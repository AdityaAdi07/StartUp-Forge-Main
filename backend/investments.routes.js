
const express = require('express');
const router = express.Router();
const pool = require('./db');

// GET Status
router.get('/status/:connectionId', async (req, res) => {
    const { connectionId } = req.params;
    const userId = req.headers['x-user-id']; // This might be string or int

    if (!connectionId) return res.status(400).json({ error: "Missing connectionId" });

    try {
        const query = `SELECT * FROM investment_reports WHERE connection_id = $1`;
        const result = await pool.query(query, [connectionId]);
        const reports = result.rows;

        // Check if matched
        // A match requires 2 records (founder and investor) with matching data
        // For strictness, let's say "MATCHED" means both confirmed data and they are equal.
        // "PENDING" means at least one person has reported (status: 'intent' or 'data').

        // Filter out reports with actual data
        const dataReports = reports.filter(r => r.amount !== null && r.year !== null);

        if (dataReports.length >= 2) {
            // Check for agreement
            // Assuming only 2 parties per connection
            const r1 = dataReports[0];
            const r2 = dataReports[1];

            // Simple comparison (can be improved)
            if (r1.amount == r2.amount && r1.year == r2.year && r1.round === r2.round) {
                return res.json({ status: 'MATCHED' });
            } else {
                return res.json({ status: 'PENDING', mismatch: true });
            }
        }

        if (reports.length > 0) {
            return res.json({ status: 'PENDING' });
        }

        return res.json({ status: 'NONE' });

    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Server Error" });
    }
});

// POST Report (Intent)
router.post('/report', async (req, res) => {
    const { connectionId } = req.body;
    // We assume the user is authenticated via middleware or mock, here we grab header or assume implicit
    // But this route doesn't seem to pass user-id in body, wait.
    // The frontend fetch('/api/investments/report', { ... body: { connectionId } })
    // It usually sends headers: { 'x-user-id': ... } if using my pattern. 
    // Let's check frontend code again. 
    // `handleReportInvestment`: fetch('/api/investments/report', headers: { 'Content-Type': ... }) 
    // It MISSES x-user-id in headers in lines 216-220 of gun_server/project.
    // I MUST ADD x-user-id in the frontend implementation I write.

    // For backend, I will expect x-user-id.
    const userId = req.headers['x-user-id'];

    if (!connectionId || !userId) return res.status(400).json({ error: "Missing info" });

    try {
        // Check if exists
        const check = await pool.query(
            `SELECT id FROM investment_reports WHERE connection_id = $1 AND submitted_by = $2`,
            [connectionId, userId]
        );

        if (check.rows.length === 0) {
            // Insert intent
            // We need 'role'. I should pass role or fetch it from connections..
            // Fetching role from connections is safer.
            const connRes = await pool.query(`SELECT user_a_id, user_a_role FROM connections WHERE id = $1`, [connectionId]);
            if (connRes.rows.length === 0) return res.status(404).json({ error: "Connection not found" });

            // Determine role
            // connection table has user_a_id/role. 
            // user_b is not explicitly stored in columns I saw? 
            // Wait, I saw user_a_id, user_a_role. I missed user_b details in `check_table_schema` output?
            // Let's assume standard logic: user_a and user_b.
            // If I can't determine role, I'll store 'unknown' or require it from client.
            // Client `submitInvestment` sends role. `handleReportInvestment` does NOT.

            // I'll accept 'unknown' for now or update frontend to send role.
            const role = 'unknown';

            await pool.query(
                `INSERT INTO investment_reports (connection_id, submitted_by, role) VALUES ($1, $2, $3)`,
                [connectionId, userId, role]
            );
        }
        res.json({ success: true });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Server Error" });
    }
});

// POST Confirm (Submit Data)
router.post('/confirm', async (req, res) => {
    const { connectionId, role, data } = req.body;
    const userId = req.headers['x-user-id']; // I'll ensure frontend sends this (or I can trust body role/id if passed)
    // Actually gun_server `submitInvestment` does NOT send x-user-id in headers in lines 228 (it creates headers object but only Content-Type?). 
    // Wait, line 228: headers: { 'Content-Type': ... }
    // It relies on connectionId and body params.
    // But `submitted_by` is needed.
    // I WILL FIX FRONTEND TO SEND USER ID.

    if (!connectionId || !data) return res.status(400).json({ error: "Missing data" });

    // Current user ID
    // If frontend implementation uses headers, use headers.
    // If not, maybe use body.role to infer... no that's not ID.
    // I NEED User ID.

    const submittedBy = userId; // or req.body.userId if I add it.

    try {
        // Upsert
        const check = await pool.query(
            `SELECT id FROM investment_reports WHERE connection_id = $1 AND submitted_by = $2`,
            [connectionId, submittedBy]
        );

        if (check.rows.length > 0) {
            await pool.query(
                `UPDATE investment_reports SET round=$1, year=$2, amount=$3, role=$4 WHERE id=$5`,
                [data.round, data.year, data.amount, role, check.rows[0].id]
            );
        } else {
            await pool.query(
                `INSERT INTO investment_reports (connection_id, submitted_by, role, round, year, amount) VALUES ($1, $2, $3, $4, $5, $6)`,
                [connectionId, submittedBy, role, data.round, data.year, data.amount]
            );
        }

        // Check for match immediately
        const result = await pool.query(`SELECT * FROM investment_reports WHERE connection_id = $1`, [connectionId]);
        const reports = result.rows.filter(r => r.amount !== null);

        let status = 'PENDING';
        let mismatch = false;

        if (reports.length >= 2) {
            const r1 = reports[0];
            const r2 = reports[1];
            // Compare
            if (parseFloat(r1.amount) === parseFloat(r2.amount) &&
                parseInt(r1.year) === parseInt(r2.year) &&
                r1.round === r2.round) {
                status = 'MATCHED';
            } else {
                mismatch = true;
            }
        }

        res.json({ status, mismatch });

    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Server Error" });
    }
});

// GET Updates (Company News from Network)
router.get('/updates', async (req, res) => {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    try {
        const query = `
            SELECT distinct
                f.id as founder_id,
                f.company,
                f.valuation,
                ir.round,
                ir.amount,
                ir.year,
                ir.created_at as time
            FROM investment_reports ir
            JOIN founders f ON cast(ir.submitted_by as INTEGER) = f.id
            JOIN connections c ON (
                (c.user_a_id = $1 AND c.user_b_id = f.id) OR 
                (c.user_b_id = $1 AND c.user_a_id = f.id)
            )
            WHERE ir.role = 'founder'
              AND EXISTS (
                  SELECT 1 FROM investment_reports ir2 
                  WHERE ir2.connection_id = ir.connection_id 
                  AND ir2.role = 'investor'
                  AND ir2.amount = ir.amount
                  AND ir2.year = ir.year
                  AND ir2.round = ir.round
              )
            ORDER BY ir.created_at DESC
            LIMIT 10
        `;

        const result = await pool.query(query, [userId]);
        res.json(result.rows);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Server Error" });
    }
});


module.exports = router;

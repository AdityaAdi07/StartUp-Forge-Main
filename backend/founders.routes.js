const express = require('express');
const router = express.Router();
const pool = require('./db');
const axios = require('axios');

// Helper to extract latest funding
function getLatestFunding(fundingJson) {
    if (!fundingJson || !Array.isArray(fundingJson) || fundingJson.length === 0) {
        return { amount: 0, year: new Date().getFullYear() };
    }
    // Sort by year descending
    const sorted = fundingJson.sort((a, b) => (b.year || 0) - (a.year || 0));
    const latest = sorted[0];
    return {
        amount: latest.amount || 0,
        year: latest.year || new Date().getFullYear()
    };
}

// GET Growth Prediction for a Founder
router.get('/growth/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const query = `SELECT * FROM founders WHERE id = $1`;
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Founder not found" });
        }

        const founder = result.rows[0];
        const latestFunding = getLatestFunding(founder.past_funding);

        // Prepare payload for Python Service
        const payload = {
            company: founder.company,
            domain: founder.domain,
            funding_amount: parseFloat(latestFunding.amount),
            valuation: parseFloat(founder.valuation || 0),
            funding_year: parseInt(latestFunding.year),
            competitors: founder.competitors || [],
            umbrella_companies: founder.umbrella_companies || []
        };

        // Call Python Service
        try {
            const pythonRes = await axios.post('http://localhost:8002/predict', payload);
            res.json(pythonRes.data);
        } catch (pyErr) {
            console.error("Python Service Error:", pyErr.message);
            // Fallback if Python service is down
            res.json({
                growth_rate: 0.1,
                growth_class: 'Low (Fallback)',
                valuation_projection: {
                    "3_months": (founder.valuation || 0) * 1.02,
                    "6_months": (founder.valuation || 0) * 1.05,
                    "1_year": (founder.valuation || 0) * 1.10,
                    "5_years": (founder.valuation || 0) * 1.50
                },
                acquisition_probability: 0.1
            });
        }

    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Server Error" });
    }
});

module.exports = router;

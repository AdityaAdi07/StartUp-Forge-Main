
const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'StrongPassword123',
    database: 'startupforge_db'
});

async function inspect() {
    try {
        console.log("🔌 Connecting to Postgres...");

        // 1. Get All Tables
        const tables = await pool.query(`
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
        `);
        console.log("\n📄 Tables found:");
        tables.rows.forEach(t => console.log(`   - ${t.table_name}`));

        // 2. Loop through tables and get columns
        for (const t of tables.rows) {
            const cols = await pool.query(`
                SELECT column_name, data_type, udt_name
                FROM information_schema.columns 
                WHERE table_name = $1
            `, [t.table_name]);
            console.log(`\n📄 Columns for '${t.table_name}':`);
            cols.rows.forEach(c => console.log(`   - ${c.column_name}: ${c.data_type} (udt: ${c.udt_name})`));
        }

    } catch (err) {
        console.error("❌ Postgres Error:", err.message);
    } finally {
        await pool.end();
    }
}

inspect();

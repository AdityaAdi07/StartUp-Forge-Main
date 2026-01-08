const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'StrongPassword123',
  database: 'startupforge_db'
});

module.exports = pool;

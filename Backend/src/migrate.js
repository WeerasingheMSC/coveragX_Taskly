// src/migrate.js
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

async function runMigrations() {
  const sqlPath = path.join(__dirname, 'migrations', 'create_task_table.sql');
  if (!fs.existsSync(sqlPath)) {
    console.log(`[migrate] no migration file found at ${sqlPath} — skipping migrations`);
    return;
  }

  const sql = fs.readFileSync(sqlPath, 'utf8');

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    console.log('[migrate] connecting to database...');
    await pool.query('SELECT 1'); // quick connectivity check
    console.log('[migrate] running SQL migration...');
    await pool.query(sql);
    console.log('[migrate] migrations completed.');
  } catch (err) {
    console.error('[migrate] migration error:', err);
    // exit non-zero so container startup fails (you can change behavior if you want)
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  runMigrations().catch(err => {
    console.error('[migrate] uncaught error', err);
    process.exit(1);
  });
}

module.exports = runMigrations;

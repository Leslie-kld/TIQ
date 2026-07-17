require('dotenv').config();
const { Client } = require('pg');

// Extract just the password from your current DATABASE_URL, so we can
// try it against Supabase's three different connection endpoints.
const match = process.env.DATABASE_URL.match(/:([^:@]+)@/);
const password = match[1];

const targets = {
  'Session pooler (5432)': `postgresql://postgres.cktloultkqhxmvlgauoh:${password}@aws-0-eu-west-1.pooler.supabase.com:5432/postgres`,
  'Transaction pooler (6543)': `postgresql://postgres.cktloultkqhxmvlgauoh:${password}@aws-0-eu-west-1.pooler.supabase.com:6543/postgres`,
  'Direct (5432)': `postgresql://postgres:${password}@db.cktloultkqhxmvlgauoh.supabase.co:5432/postgres`
};

async function testAll() {
  for (const [name, connStr] of Object.entries(targets)) {
    const client = new Client({ connectionString: connStr, connectionTimeoutMillis: 8000 });
    try {
      await client.connect();
      await client.query('SELECT 1');
      console.log(`${name}: SUCCESS`);
      await client.end();
    } catch (err) {
      console.log(`${name}: FAILED - ${err.message}`);
    }
  }
}

testAll();
const { Client } = require('pg');
const client = new Client({
  connectionString: "postgresql://postgres.pwauorkrbngkvepluqqh:c9q%3F%24h%21%2EeY%3FPTz2@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
});

async function check() {
  try {
    await client.connect();
    const res = await client.query('SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = \'public\'');
    console.log('Tablas encontradas:', res.rows.map(r => r.tablename));
    await client.end();
  } catch (err) {
    console.error('Error de conexión:', err.message);
    process.exit(1);
  }
}

check();

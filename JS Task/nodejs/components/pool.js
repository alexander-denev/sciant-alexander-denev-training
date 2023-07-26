const { Pool, types: pgTypes } = require('pg');
const env = process.env;
const pool = new Pool({
  user: env.POSTGRES_USER || 'root',
  password: env.POSTGRES_PASSWORD || 'root',
  host: env.POSTGRES_HOST || 'localhost',
  port: env.POSTGRES_PORT || 5432,
  database: env.POSTGRES_DB || 'baza',
});
pgTypes.setTypeParser(pgTypes.builtins.NUMERIC, parseFloat);

module.exports = pool;

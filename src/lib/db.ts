
import pg from 'pg';
const { Pool } = pg;

const connectionString = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;

export const pgPool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

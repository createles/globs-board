import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;

const poolConfig = process.env.DATABASE_URL
  ? {
    connectionString: process.env.DATABASE_URL,
  }
  : {
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
  };

const pool = new Pool(poolConfig);

export default pool;

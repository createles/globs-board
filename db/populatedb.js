import 'dotenv/config';
import pg from 'pg';

const { Client } = pg;

const SQL = `
DROP TABLE IF EXISTS "session" CASCADE;
DROP TABLE IF EXISTS community_memberships CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS communities CASCADE;
DROP TABLE IF EXISTS users CASCADE;


CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username VARCHAR ( 255 ) UNIQUE NOT NULL,
  first_name VARCHAR ( 255 ) NOT NULL,
  last_name VARCHAR ( 255 ) NOT NULL,
  hashed_password VARCHAR ( 255 ) NOT NULL,
  icon INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL,
  CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE
) WITH (OIDS=FALSE);

CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");

CREATE TABLE IF NOT EXISTS communities (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  community_name VARCHAR ( 255 ) UNIQUE NOT NULL,
  community_description TEXT NOT NULL,
  community_secret VARCHAR ( 255 ) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title VARCHAR ( 255 ) NOT NULL,
  body TEXT NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  community_id INTEGER REFERENCES communities(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS community_memberships (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  community_id INTEGER REFERENCES communities(id) ON DELETE CASCADE,
  role VARCHAR ( 50 ) DEFAULT 'standard',
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, community_id)
);
`

async function main() {
  console.log("Seeding database...");

  const client = new Client({
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
  });

  await client.connect();
  await client.query(SQL);
  await client.end();

  console.log("Completed seeding process.")
}

main();
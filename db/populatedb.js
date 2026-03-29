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
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  community_id INTEGER REFERENCES communities(id) ON DELETE CASCADE NOT NULL,
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

-- SEED 10 USERS WITH VARIOUS AVATARS (1-6)
INSERT INTO users (username, first_name, last_name, hashed_password, icon) VALUES
  ('pc_builder_99', 'Alex', 'Hardware', 'dummyhash123', 1),
  ('kanji_learner', 'Sarah', 'Connor', 'dummyhash123', 2),
  ('baker_bob', 'Bob', 'Ross', 'dummyhash123', 3),
  ('node_ninja', 'Jane', 'Doe', 'dummyhash123', 4),
  ('glow_up_guru', 'Emma', 'Smith', 'dummyhash123', 5),
  ('mech_fanatic', 'Chris', 'Evans', 'dummyhash123', 6),
  ('odin_student', 'Mark', 'Twain', 'dummyhash123', 5),
  ('tokyo_drifter', 'Ken', 'Watanabe', 'dummyhash123', 2),
  ('pastry_chef', 'Julia', 'Child', 'dummyhash123', 3),
  ('express_dev', 'Linus', 'Torvalds', 'dummyhash123', 4);

-- SEED 5 COMMUNITIES WITH SPACES IN THEIR NAMES
INSERT INTO communities (community_name, community_description, community_secret) VALUES
  ('PC Gaming Hardware', 'Discuss rigs, monitors, and games.', 'secret1'),
  ('Japanese Language', 'Practice grammar and kanji.', 'secret2'),
  ('Home Baking', 'Share recipes and tips.', 'secret3'),
  ('Web Development', 'From Node.js to full stack deployments.', 'secret4'),
  ('Skincare Routine', 'Share your daily regimens and product reviews.', 'secret5');

-- SEED COMMUNITY MEMBERSHIPS
INSERT INTO community_memberships (user_id, community_id, role) VALUES
  (1, 1, 'admin'), (6, 1, 'standard'), (8, 1, 'standard'),
  (2, 2, 'admin'), (7, 2, 'standard'), (8, 2, 'standard'),
  (3, 3, 'admin'), (9, 3, 'standard'), (5, 3, 'standard'),
  (4, 4, 'admin'), (7, 4, 'standard'), (10, 4, 'standard'),
  (5, 5, 'admin'), (2, 5, 'standard'), (9, 5, 'standard');

-- SEED THE FLUID WITH 15 REALISTIC POSTS
INSERT INTO posts (title, body, user_id, community_id) VALUES
  ('Best HDR settings for KTC M27T6?', 'I just picked up this monitor and want to get the colors right for gaming. Any calibration tips to avoid washed-out grays?', 1, 1),
  ('Struggling with N4 Kanji', 'Does anyone have a good strategy for remembering readings? Flashcards help, but I still get confused when vocab words combine them.', 2, 2),
  ('Overnight Cinnamon Rolls', 'Can I leave the dough in the fridge overnight for the second proof? I want to bake them fresh in the morning without waking up at 4 AM.', 3, 3),
  ('Stuck on The Odin Project: Express Routing', 'I am working through the Node.js/Express curriculum and my router keeps throwing a 404 on POST requests. What am I missing?', 7, 4),
  ('Morning Routine Critique', 'Currently using a gentle cleanser, hyaluronic acid, and SPF 50. Should I be adding Vitamin C before or after the acid?', 5, 5),
  ('TCL 50C636 PC Calibration', 'Using this TV as a secondary display. Text looks a bit fuzzy. Are there specific chroma subsampling settings I need to tweak in the NVIDIA control panel?', 6, 1),
  ('Speaking practice resources?', 'Listening and reading are fine, but my output is terrible. Are there any good Discord servers for casual conversation?', 8, 2),
  ('Why use PostgreSQL over MongoDB?', 'Building a forum app and trying to decide on the database. SQL seems rigid but everyone says it is better for relational data. Thoughts?', 10, 4),
  ('Sourdough Starter Day 5', 'It smells strongly like nail polish remover (acetone). Is it hungry or did I kill it?', 9, 3),
  ('Winter moisturizers for dry climates', 'The heating in my apartment is destroying my skin barrier. Need heavy-duty cream recommendations!', 2, 5),
  ('Finally beat Elden Ring', '140 hours later. What an absolute masterpiece of game design. What should I play next?', 1, 1),
  ('Deploying Node.js apps', 'What is the current consensus for cheap/free hosting now that Heroku killed their free tier? Render? Railway?', 4, 4),
  ('Kanji stroke order - does it really matter?', 'If I am just writing for myself, is it a big deal if I do the strokes out of sequence?', 7, 2),
  ('Perfecting chocolate chip cookies', 'Browning the butter beforehand changes EVERYTHING. Do not skip this step.', 3, 3),
  ('Mechanical vs Membrane for typing', 'I know mechanical is better for gaming, but for writing code all day, what switches do you prefer? Brown or Red?', 6, 1);
`

async function main() {
  console.log("Seeding database...");

  const client = new Client(
    process.env.DATABASE_URL ? {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    } :
    {
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
  });

  await client.connect();
  await client.query(SQL);
  await client.end();

  console.log("Completed seeding process. The fluid is filled.")
}

main();
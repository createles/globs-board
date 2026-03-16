import express from 'express';
import session from 'express-session';
import path from "node:path";
import { fileURLToPath } from 'node:url';
import "dotenv/config";
import connectPgSimple from 'connect-pg-simple';
import { Pool } from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// set views folder and view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// allow to parse form body
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
import express from 'express';
import session from 'express-session';
import path from "node:path";
import { fileURLToPath } from 'node:url';
import "dotenv/config";
import connectPgSimple from 'connect-pg-simple';
import pool from './db/pool.js';
import appRouter from './routes/appRouter.js';
import passport from './config/passport.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// set views folder and view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// allow to parse form body
app.use(express.urlencoded({ extended: true }));

// public folder setup
app.use(express.static(path.join(__dirname, 'public')));

const pgSession = connectPgSimple(session);

// session middleware to handle storing session cookies in db
app.use(session({
  store: new pgSession({
    pool: pool, // use our pool connection
    tableName: 'session' // use 'session' table to store cookies
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000
  }
}))

// Initialize passport, use session to manage state
app.use(passport.initialize());
app.use(passport.session());

// Intercept all routes, look at req.user, grab user info
// and pin it to res.locals.currentUser
app.use((req, res, next) => {
  res.locals.currentUser = req.user; 
  next();
});

app.use('/', appRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
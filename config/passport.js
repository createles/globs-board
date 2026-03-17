import passport from 'passport';
import passportLocal from 'passport-local';
import bcrypt from 'bcryptjs';
import pool from '../db/pool.js';

const LocalStrategy = passportLocal.Strategy;

const customStrategy = new LocalStrategy(async (username, password, done) => {
  try {
    // Find the user in the database
    const { rows } = await pool.query('SELECT * FROM users WHERE username = $1;', [username]);
    const user = rows[0];

    if (!user) {
      // User doesn't exist in the database
      return done(null, false, { message: "Incorrect username" });
    }

    // Compare the password with hashed_password in DB
    const match = await bcrypt.compare(password, user.hashed_password);

    if (!match) {
      // Passwords don't match
      return done(null, false, { message: "Incorrect password" });
    }

    // On success, pass user object to passport
    return done(null, user);
  } catch (err) {
    return done(err);
  }
});

// Use strategy
passport.use(customStrategy);

// Store user's id into the cookie
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Pass user object by using the ID in the cookie
passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1;', [id]);
    const user = rows[0];

    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;
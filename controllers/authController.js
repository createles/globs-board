import bcrypt from "bcryptjs";
import pool from "../db/pool.js";
import { body, validationResult } from "express-validator";

export async function signUpPost(req, res, next) {
  try {
    const { firstName, lastName, username, password, passwordConfirm, icon } =
      req.body;

    if (password !== passwordConfirm) {
      console.error("Password mismatch.");
      return res.redirect("/signup"); 
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      `INSERT INTO users (username, first_name, last_name, hashed_password, icon)
    VALUES ($1, $2, $3, $4, $5);`,
      [username, firstName, lastName, hashedPassword, icon],
    );

    res.redirect("/login");
  } catch (err) {
    console.error("Failed to proceed with user sign-up.", err);
    return res.redirect("/signup");
  }
}

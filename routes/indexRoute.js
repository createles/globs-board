import { Router } from "express";
import * as db from '../db/queries.js';

const router = Router();

router.get("/", (req, res) => {
  res.render("splash", { title: "Globs - thoughts and spaces" });
});

router.get("/dashboard", async (req, res, next) => {
  try {
    const posts = await db.getAllPosts();
    
    res.render("dashboard", { 
      title: "Globs - Dashboard",
      posts: posts // Pass the array to the view
    });
  } catch (err) {
    next(err);
  }
});

export default router;
import { Router } from "express";
import * as db from '../db/queries.js';

const router = Router();

// Update the root route to be async and fetch posts
router.get("/", async (req, res, next) => {
  try {
    const posts = await db.getAllPosts();
    
    res.render("splash", { 
      title: "Globs - blips and thoughts",
      // Pass a couple of posts to splash page
      posts: posts.slice(0, 3) 
    });
  } catch (err) {
    next(err);
  }
});

router.get("/dashboard", async (req, res, next) => {
  try {
    // Check the URL for a query parameter (e.g., ?feed=followed)
    const feedType = req.query.feed; 
    let posts = [];

    // If logged in and clicked followed feed
    if (feedType === 'followed' && req.isAuthenticated()) {
      posts = await db.getFollowedPosts(req.user.id);
    } else {
      // Otherwise, default to the global feed
      posts = await db.getAllPosts();
    }
    
    res.render("dashboard", { 
      title: "Globs - Dashboard",
      posts: posts,
      currentFeed: feedType === 'followed' ? 'followed' : 'global' // Pass this to EJS for styling!
    });
  } catch (err) {
    next(err);
  }
});

export default router;
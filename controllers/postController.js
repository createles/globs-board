import * as db from '../db/queries.js';
import { validationResult } from 'express-validator';

export const newPostGet = async (req, res, next) => {
  try {
    const communities = await db.getAllCommunities()

    res.render("new-post",
      { title: 'New Post',
        communities: communities
      }
    )
  } catch (err) {
    console.error("Failed to render new post view. Please try again.", err)
    res.redirect("/dashboard");
  }
}

export const newPostPost = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const communities = await db.getAllCommunities();

      // Map errors into a simple array for iteration
      const mappedErrors = errors.array().map(err => err.msg);
      return res.render("new-post", {
        title: "New Post",
        communities: communities,
        errorMessages: mappedErrors, // transform to an array to display err msgs
      });
    }

    const { title, body, communityId } = req.body;
    const userId = req.user.id;

    await db.createPost(title, body, userId, communityId);

    res.redirect("/dashboard");
  } catch (err) {
    console.error("Failed to create new post:", err);

    try {
      // Attempt to fetch communities again to rebuild the page
      const communities = await db.getAllCommunities();

      return res.render("new-post", {
        title: "New Post",
        communities: communities,
        // Pass previous input to view
        previousInput: req.body,
        errorMessages: ["Something went wrong saving your post. Please try again."]
      });
    } catch (recoveryErr) {
      // Checks if the database is completely offline or unresponsive
      // Pass the original error to Express to show a generic 500 Error page.
      return next(err);
    }
  }
}

export const postDeletePost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.id; 

    // Securely delete the post
    await db.deletePost(postId, userId);

    // Grab the URL the user came from (if the browser sent it)
    const previousPage = req.header('Referer');

    // If we have the previous page, go there. Otherwise, default to the dashboard
    if (previousPage) {
      res.redirect(previousPage);
    } else {
      res.redirect("/dashboard");
    }

  } catch (err) {
    next(err);
  }
};
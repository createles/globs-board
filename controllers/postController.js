import * as db from '../db/queries.js';

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
    const { title, body, communityId } = req.body;
    const userId = req.user.id;

    await db.createPost(title, body, userId, communityId)

    res.redirect("/dashboard");
  } catch (err) {
    console.error("Failed to create new post. Please try again.", err)
    res.redirect("/post/new");
  }
}
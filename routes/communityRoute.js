import { Router } from "express";
import * as db from '../db/queries.js';
import { isAuth } from "../middleware/authMiddleware.js"; // Don't forget to import your bouncer!

const router = Router();

router.get("/:communityName", async (req, res, next) => {
  try {
    const communityName = req.params.communityName;
    const community = await db.getCommunityByName(communityName);
    
    if (!community) return res.status(404).send("404: Community not found!"); 

    const posts = await db.getPostsByCommunityId(community.id);

    // Check if the user is logged in AND if they are a member
    let isMember = false;
    if (req.isAuthenticated()) {
      const membership = await db.checkMembership(req.user.id, community.id);
      if (membership) isMember = true; // set to true if user is a member
    }

    res.render("community-page", {
      title: `g/${community.community_name} - Globs`,
      community: community,
      posts: posts,
      isMember: isMember // Pass the boolean to EJS to update button
    });

  } catch (err) {
    next(err);
  }
});

// Clicking the Join button in a community
router.post("/:communityName/join", isAuth, async (req, res, next) => {
  try {
    const communityName = req.params.communityName;
    const community = await db.getCommunityByName(communityName);

    if (!community) return res.status(404).send("404: Community not found!"); 

    // Add them to the database!
    await db.joinCommunity(req.user.id, community.id);

    // Redirect them right back to the community page so the button updates
    res.redirect(`/g/${communityName}`);

  } catch (err) {
    next(err);
  }
});

export default router;
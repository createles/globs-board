import { Router } from "express";
import * as db from '../db/queries.js';

const router = Router();

router.get("/:communityName", async (req, res, next) => {
  try {
    const communityName = req.params.communityName;
    
    // Check that the community exists
    const community = await db.getCommunityByName(communityName);
    
    // If a user types in a bad URL (e.g., /communities/fakemadesupstuff)
    if (!community) {
      return res.status(404).send("404: Community not found!"); 
    }

    // Fetch posts from the community
    const posts = await db.getPostsByCommunityId(community.id);

    // 3. Render the community page
    res.render("community-page", {
      title: `Globs - g/${community.community_name}`,
      community: community,
      posts: posts
    });

  } catch (err) {
    next(err);
  }
});

export default router;
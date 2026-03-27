import pool from "./pool.js";

export async function getAllCommunities() {
  const result = await pool.query(
    `SELECT id, community_name FROM communities`
  );

  return result.rows;
}

export async function createPost(title, body, userId, communityId) {
  const result = await pool.query(
    `INSERT INTO posts (title, body, user_id, community_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
    `,
    [title, body, userId, communityId]
  );

  return result.rows[0];
}

export async function getAllPosts() {
  const result = await pool.query(
    `SELECT 
       posts.id, 
       posts.title, 
       posts.body, 
       posts.created_at,
       posts.user_id,
       users.username AS author_name,
       users.icon AS author_icon,
       communities.community_name
     FROM posts
     JOIN users 
       ON posts.user_id = users.id
     JOIN communities 
       ON posts.community_id = communities.id
     ORDER BY posts.created_at DESC;`
  );

  return result.rows;
}

// Fetch a single post by its ID
export async function getPostById(postId) {
  const result = await pool.query(
    `SELECT 
       posts.id, 
       posts.title, 
       posts.body, 
       posts.created_at,
       posts.user_id,
       users.username AS author_name,
       users.icon AS author_icon,
       communities.community_name
     FROM posts
     JOIN users ON posts.user_id = users.id
     JOIN communities ON posts.community_id = communities.id
     WHERE posts.id = $1;`,
    [postId]
  );
  
  return result.rows[0]; // Return the single post object
}

export async function getCommunityByName(communityName) {
  const result = await pool.query(
    `SELECT * FROM communities WHERE community_name = $1;`,
    [communityName]
  );
  
  // Returns just the single community object, or undefined if it doesn't exist
  return result.rows[0];
}

export async function getPostsByCommunityId(communityId) {
  const result = await pool.query(
    `SELECT 
       posts.id, 
       posts.title, 
       posts.body, 
       posts.created_at,
       posts.user_id,
       users.username AS author_name,
       users.icon AS author_icon,
       communities.community_name
     FROM posts
     JOIN users 
       ON posts.user_id = users.id
     JOIN communities 
       ON posts.community_id = communities.id
     WHERE posts.community_id = $1
     ORDER BY posts.created_at DESC;`,
    [communityId]
  );

  return result.rows;
}

// Get posts ONLY from communities the user has joined
export async function getFollowedPosts(userId) {
  const result = await pool.query(
    `SELECT 
       posts.id, 
       posts.title, 
       posts.body, 
       posts.created_at,
       posts.user_id,
       users.username AS author_name,
       users.icon AS author_icon,
       communities.community_name
     FROM posts
     JOIN users 
       ON posts.user_id = users.id
     JOIN communities 
       ON posts.community_id = communities.id
     JOIN community_memberships
       ON communities.id = community_memberships.community_id
     WHERE community_memberships.user_id = $1
     ORDER BY posts.created_at DESC;`,
    [userId]
  );

  return result.rows;
}

// Check if a user is currently a member of a community
export async function checkMembership(userId, communityId) {
  const result = await pool.query(
    `SELECT * FROM community_memberships 
     WHERE user_id = $1 AND community_id = $2;`,
    [userId, communityId]
  );
  
  // Returns the membership row if it exists, or undefined if they haven't joined
  return result.rows[0]; 
}

// Add the user to the community
// ON CONFLICT DO NOTHING will ignore duplicated requests (user already joined community)
export async function joinCommunity(userId, communityId) {
  await pool.query(
    `INSERT INTO community_memberships (user_id, community_id, role)
     VALUES ($1, $2, 'standard')
     ON CONFLICT DO NOTHING;`, 
    [userId, communityId]
  );
}

// Delete post
export async function deletePost(postId, userId) {
  // Only deletes rows for posts that match the correct user_id in the posts table
  await pool.query(
    `DELETE FROM posts WHERE id = $1 AND user_id = $2;`,
    [postId, userId]
  );
}
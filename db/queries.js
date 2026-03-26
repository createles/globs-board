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
       users.username AS author_name,
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
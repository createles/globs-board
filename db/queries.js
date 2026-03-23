import { response } from "express";
import pool from "pool.js";

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
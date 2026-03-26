import { Router } from "express";
import { isAuth } from "../middleware/authMiddleware.js";
import { newPostGet, newPostPost, postDeletePost } from "../controllers/postController.js";
import { body } from "express-validator"

const router = Router();

// Validation Rules
const validatePost = [
  body("title").trim().notEmpty().withMessage("Title cannot be empty").isLength({ max: 255 }).withMessage("Title is too long"),
  body("body").trim().notEmpty().withMessage("Message cannot be empty"),
  body("communityId").notEmpty().withMessage("Please select a community")
];

router.get("/", (req, res) => {
  res.send("This route is wired up correctly!");
});

router.get("/new", isAuth, newPostGet);
router.post("/new", isAuth, validatePost, newPostPost);

// Post deletion route
router.post("/:postId/delete", isAuth, postDeletePost);

export default router;
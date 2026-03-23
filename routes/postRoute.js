import { Router } from "express";
import { isAuth } from "../middleware/authMiddleware.js";
import { newPostGet, newPostPost } from "../controllers/postController.js";

const router = Router();

router.get("/", (req, res) => {
  res.send("This route is wired up correctly!");
});

router.get("/new", isAuth, newPostGet);
router.post("/new", isAuth, newPostPost);

export default router;
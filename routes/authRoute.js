import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.send("This route is wired up correctly!");
});

export default router;
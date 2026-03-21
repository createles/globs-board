import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.render("splash", { title: "Globs - thoughts and spaces" });
});

router.get("/dashboard", (req, res) => {
  res.render("dashboard", { 
    title: "Globs - Dashboard"
  })
});

export default router;
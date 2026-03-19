import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.send("This route is wired up correctly!");
});

router.get("/dashboard", (req, res) => {
  res.render("dashboard", { 
    title: "Globs - Dashboard"
  })
});

export default router;
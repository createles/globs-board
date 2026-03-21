import { Router } from "express";
import { signUpPost } from "../controllers/authController.js";
import passport from "passport";

const router = Router();

router.get("/signup", (req, res) => {
  res.render("signup", { title: "Globs - Sign Up"});
})

router.post("/signup", signUpPost);

router.get("/login", (req, res) => {
  res.render("login", { title: "Globs - Log In"});
})

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  }),
);

router.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});

export default router;
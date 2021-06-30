const express = require("express");
const passport = require("passport");
const router = express.Router();
const authControllers = require("../controllers/authController");
const joiMiddleware = require("../middleware/joiMiddleware");
const { userSignUp, userLogin, resetPassword } = require("../validators/auth");

/* User Sign Up */
router.post("/signup", joiMiddleware(userSignUp), authControllers.signup);

/* User Login */
router.post("/login", joiMiddleware(userLogin), authControllers.login);

/* Forgot Password */
router.post("/forgotpassword", authControllers.forgotPassword);

/* Reset Password */
router.post(
  "/resetPassword/:token",
  joiMiddleware(resetPassword),
  authControllers.resetPassword
);

/* Google Login */
router.get(
  "/googlelogin",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `https://localhost:4000/api/auth/login`,
  }),
  (req, res) => {
    authControllers.googleResponse(req.user, res);
  }
);


module.exports = router;

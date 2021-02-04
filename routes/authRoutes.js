const express = require("express");
const passport = require("passport");
const router = express.Router();
const authControllers = require("../controllers/authController");
const middleware = require("../helpers/middleware");
const schemas = require("../helpers/schemas");

router.post(
  "/signup",
  middleware(schemas.authSignUpModel),
  authControllers.signup
);
router.post("/login", authControllers.login);

router.post("/forgotpassword", authControllers.forgotPassword);
router.post("/resetPassword", authControllers.resetPassword);

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

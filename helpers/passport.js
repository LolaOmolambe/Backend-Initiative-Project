const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const authController = require("../controllers/authController");

passport.use(
  new GoogleStrategy(
    {
      callbackURL: process.env.GOOGLE_REDIRECT_URL, //same URI as registered in Google console portal
      clientID: process.env.GOOGLE_CLIENT_ID, //replace with copied value from Google console
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user_email = profile.emails && profile.emails[0].value; //profile object has the user info
        let name = profile.displayName;

        let user = await User.findOne({ email: user_email }); //check whether user exist in database

        if (user) {
          //Login User
          user.password = "";
          return done(null, user);
        } else {
          //sign up
          const newUser = await new User({
            name,
            email: user_email,
          }).save({ validateBeforeSave: false });

          return done(null, newUser);
        }
      } catch (error) {
        done(error);
      }
    }
  )
);

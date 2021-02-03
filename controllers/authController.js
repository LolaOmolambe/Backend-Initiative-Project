const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const assignToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.EXPIRESIN,
  });
};

exports.loginResponse = (user, res) => {
  let token = assignToken(user._id);

  user.password = "";

  res.status(200).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.login = async (req, res, next) => {
  try {
    let { email, password } = req.body;

    //Validation for Bad Input
    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Email or password is null",
        data: null,
      });
    }

    //Find User
    let user = await User.findOne({ email }).select("+password");

    //Check if user exists and password is correct
    if (!user || !(await user.rightPassword(password, user.password))) {
      return res.status(401).json({
        status: "error",
        message: "Incorrect email or password",
        data: null,
      });
    }

    //Login User
    loginResponse(user, res);
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Oops, Something went wrong",
      error: err,
    });
  }
};

exports.signup = async (req, res, next) => {
  try {
    let { password, confirmPassword } = req.body;
    if (password != confirmPassword) {
      res.status(400).json({
        status: "error",
        message: "Password mismatch",
        data: null,
      });
    }

    let user = await User.create(req.body);

    //Allow login
    loginResponse(user, res);
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Oops, Something went wrong",
      error: err,
    });
  }
};

exports.protectRoutes = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(400).json({
        status: "error",
        message: "No token provided. Please login",
        data: null,
      });
    }

    let decodedToken = await jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decodedToken.userId);

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "User does not exist",
        data: null,
      });
    }
    req.user = user;
    next();
  } catch (err) {}
};

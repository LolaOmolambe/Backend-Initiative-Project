const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const assignToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.EXPIRESIN,
  });
};

const loginResponse = (user, res) => {
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

exports.googleResponse = (user, res) => {
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
      return res.status(400).json({
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

exports.forgotPassword = async (req, res, next) => {
  try {
    //Find the User
    let user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "No user with this email address",
        data: null,
      });
    }

    //Generate the reset token
    let resetToken = user.createPasswordToken();
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: "success",
      message: "Token generated successfully",
      data: {
        resetToken,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Oops, Something went wrong",
      error: err,
    });
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    let { token, password, confirmPassword } = req.body;

    if (!token) {
      return res.status(404).json({
        status: "error",
        message: "Token is empty",
        data: null,
      });
    }
    let hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    let user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message:
          "Token is invalid or has expired. Initiate Forgot password again",
        data: null,
      });
    }

    if (password != confirmPassword) {
      return res.status(400).json({
        status: "error",
        message: "Password mismatch",
        data: null,
      });
    }

    user.password = password;
    user.confirmPassword = confirmPassword;
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;

    await user.save();

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

//MiddleWares
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
        message: "You are not authenticated. Please login",
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
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Oops, Something went wrong",
      error: err,
    });
  }
};


exports.rolesAllowed = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: "error",
        message: "You are not authorized to access this route",
        data: null,
      });
    }
    next();
  };
};

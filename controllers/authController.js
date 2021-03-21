const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { successResponse } = require("../helpers/response");
const AppError = require("../helpers/appError");

const assignToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.EXPIRESIN,
  });
};

const loginResponse = (user, res) => {
  let token = assignToken(user._id);

  user.password = "";

  return successResponse(res, 200, "Login Successfull", { user, token });
};

exports.googleResponse = (user, res) => {
  let token = assignToken(user._id);

  user.password = "";
  return successResponse(res, 200, "Login Successfull", { user });
};

exports.login = async (req, res, next) => {
  try {
    let { email, password } = req.body;

    //Validation for Bad Input
    if (!email || !password) {
      return next(new AppError("Email or password is null", 400));
    }

    //Find User
    let user = await User.findOne({ email }).select("+password");

    //Check if user exists and password is correct
    if (!user || !(await user.rightPassword(password, user.password))) {
      return next(new AppError("Incorrect email or password", 401));
    }

    //Login User
    loginResponse(user, res);
  } catch (err) {
    next(err);
  }
};

exports.signup = async (req, res, next) => {
  try {
    let { password, confirmPassword } = req.body;
    if (password != confirmPassword) {
      return next(new AppError("Password mismatch", 400));
    }

    let user = await User.create(req.body);

    //Allow login
    loginResponse(user, res);
  } catch (err) {
    next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    //Find the User
    let user = await User.findOne({ email: req.body.email });

    if (!user) {
      return next(new AppError("No user with this email address", 401));
    }

    //Generate the reset token
    let resetToken = user.createPasswordToken();
    await user.save({ validateBeforeSave: false });

    return successResponse(res, 200, "Token generated successfully", {
      resetToken,
    });
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    let { token, password, confirmPassword } = req.body;

    if (!token) {
      return next(new AppError("Token is empty", 404));
    }
    let hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    let user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return next(
        new AppError(
          "Token is invalid or has expired. Initiate Forgot password again",
          404
        )
      );
    }

    if (password != confirmPassword) {
      return next(new AppError("Password mismatch", 400));
    }

    user.password = password;
    user.confirmPassword = confirmPassword;
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;

    await user.save();

    //Allow login
    loginResponse(user, res);
  } catch (err) {
    next(err);
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
      return next(new AppError("You are not authenticated. Please login", 401));
    }

    let decodedToken = await jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decodedToken.userId);

    if (!user) {
      return next(new AppError("User does not exist", 401));
    }
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

exports.rolesAllowed = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You are not authorized to access this route", 403)
      );
    }
    next();
  };
};

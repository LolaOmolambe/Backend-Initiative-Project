const User = require("../models/userModel");
const Wallet = require("../models/walletModel");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { successResponse } = require("../utils/response");
const AppError = require("../errors/appError");

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

/**
 * Controller for User Login
 * @param {*} req.body.email - Email of User
 * @param {*} req.body.password - Password of User
 */
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

/**
 * Controller to register a user
 * @param {*} req.body.name - Name of User
 * @param {*} req.body.email - Email of User
 * @param {*} req.body.password - Password of User
 * @param {*} req.body.confirmPassword - Password Confirm of User
 * @returns
 */
exports.signup = async (req, res, next) => {
  try {
    req.body.role = "user";

    let user = await User.create(req.body);

    //Create Wallet for every user
    let wallet = await Wallet.create({
      balance: 0,
      user: user._id,
    });

    //Allow login
    loginResponse(user, res);
  } catch (err) {
    next(err);
  }
};

/**
 * Controller for Forgot Password Feature
 * @param {*} req.body.email - Email of User
 * @returns
 */
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

/**
 * Controller to reset password
 * @param {*} req.body.token - Reset password token
 * @param {*} req.body.password - New Password
 * @param {*} req.body.confirmPassword - Confirm password
 * @returns
 */
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

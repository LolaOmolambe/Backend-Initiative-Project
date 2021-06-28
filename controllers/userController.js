const repo = require("./generalRepo");
const User = require("../models/userModel");
const { successResponse } = require("../utils/response");
const AppError = require("../errors/appError");

/**
 * Controller to get details about a Logged in User
 * @param {*} req.user._id - Id of Logged in User
 * @returns
 */
exports.getUser = async (req, res, next) => {
  try {
    let user = await User.findById(req.user._id);

    return successResponse(res, 200, "User fetched successfully", { user });
  } catch (err) {
    next(err);
  }
};

/**
 * Controller to update user's name and/or profile picture
 * @param {} req.body.name - Name of User
 * @param {} req.file.picture - Profile Picture
 * @returns
 */
exports.updateUser = async (req, res, next) => {
  try {
    //Only allow some fields get updated
    let allowedBody = {
      name: req.body.name,
    };

    if (req.file) {
      allowedBody.profilePicture = req.file.location;
    }

    let user = await User.findByIdAndUpdate(req.user._id, allowedBody, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return next(new AppError("User does not exist", 404));
    }

    return successResponse(res, 200, "User updated successfully", { user });
  } catch (err) {
    next(err);
  }
};

/**
 * Controller to delete logged in user's account
 */
exports.deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { isDeleted: true });

    return successResponse(res, 200, "User deleted successfully", null);
  } catch (err) {
    next(err);
  }
};

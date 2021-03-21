const repo = require("./generalRepo");
const User = require("../models/userModel");
const { successResponse } = require("../helpers/response");
const AppError = require("../helpers/appError");

exports.getAllUsers = repo.getAll(User);

exports.getUser = async (req, res, next) => {
  try {
    let user = await User.findById(req.user._id);

    return successResponse(res, 200, "User fetched successfully", { user });
  } catch (err) {
    next(err);
  }
};
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

exports.deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { isDeleted: true });

    return successResponse(res, 200, "User deleted successfully", null);
  } catch (err) {
    next(err);
  }
};

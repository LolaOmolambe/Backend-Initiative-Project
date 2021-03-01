const repo = require("./generalRepo");
const User = require("../models/userModel");

exports.getAllUsers = repo.getAll(User);

exports.getUser = async (req, res, next) => {
  try {
    let user = await User.findById(req.user._id);

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Oops, Something went wrong",
      data: err
    });
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
      return res.status(404).json({
        status: "error",
        message: `User does not exist`,
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Oops, Something went wrong",
      data: err
    });
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { isDeleted: true });

    res.status(200).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Oops, Something went wrong",
    });
  }
};

const repo = require("./generalRepo");
const User = require("../models/userModel");

exports.getAllUsers = repo.getAll(User);
exports.getUser = repo.getOne(User);
exports.updateUser = repo.updateOne(User);
exports.deleteUser = repo.deleteOne(User);

exports.createUser = async (req, res, next) => {
  try {
    let { name, email } = req.body;

    let newUser = await User.create({
      name,
      email,
      role: req.body.role,
    });

    res.status(201).json({
      status: "Success",
      data: newUser,
    });
  } catch (err) {
    res.status(500).json({
      message: "Oops, Something went wrong",
      error: err
    });
  }
};

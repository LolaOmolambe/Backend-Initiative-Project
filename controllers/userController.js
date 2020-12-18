const fs = require("fs");
const uuid = require("uuid");

const userData = JSON.parse(fs.readFileSync(`${__dirname}/../data/users.js`));

exports.getAllUsers = (req, res, next) => {
  try {
    let result = userData.filter((user) => user.active === true);
    res.status(200).json({
      message: "Success",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      message: "Oops, Something went wrong",
    });
  }
};

exports.getUser = (req, res, next) => {
  try {
    let result = userData.filter(
      (user) => user._id === req.params.id && user.active == true
    );
    if (result.length === 0) {
      res.status(404).json({
        message: `User with id ${req.params.id} does not exist`,
        data: [],
      });
    } else {
      res.status(200).json({
        message: "Success",
        data: result,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Oops, Something went wrong",
    });
  }
};

exports.updateUser = (req, res, next) => {
  try {
    const user = userData.find(
      (user) => user._id === req.params.id && user.active == true
    );
    if (user) {
      let { name, email } = req.body;
      userData.forEach((el) => {
        if (el._id === req.params.id) {
          el.name = name ? name : el.name;
          el.email = email ? email : el.email;
        }
        fs.writeFileSync(
          `${__dirname}/../data/users.js`,
          JSON.stringify(userData)
        );
      });
      return res.status(200).json({
        message: "Success",
        data: null,
      });
    } else {
      res.status(404).json({
        message: `User with id ${req.params.id} does not exist`,
        data: [],
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Oops, Something went wrong",
    });
  }
};

exports.deleteUser = (req, res, next) => {
  try {
    let user = userData.find((user) => user._id === req.params.id);
    if (user) {
      userData.forEach((el) => {
        if (el._id === req.params.id) {
          el.active = false;
        }
        fs.writeFileSync(
          `${__dirname}/../data/users.js`,
          JSON.stringify(userData)
        );
      });
      return res.status(200).json({
        message: "Success",
        data: null,
      });
    } else {
      res.status(404).json({
        message: `User with id ${req.params.id} does not exist`,
        data: [],
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Oops, Something went wrong",
    });
  }
};

exports.createUser = (req, res, next) => {
  try {
    let { name, email } = req.body;
    let newUser = {
      name,
      email,
      _id: uuid.v4(),
      active: true,
      role: "user",
    };

    if (!newUser.name || !newUser.email) {
      return res.status(400).json({
        message: "Please include name and email",
      });
    }
    userData.push(newUser);
    fs.writeFileSync(`${__dirname}/../data/users.js`, JSON.stringify(userData));
    res.status(201).json({
      status: "Success",
      data: newUser,
    });
  } catch (err) {
    res.status(500).json({
      message: "Oops, Something went wrong",
    });
  }
};

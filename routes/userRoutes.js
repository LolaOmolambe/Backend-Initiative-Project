const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const schemas = require("../helpers/schemas");
const middleware = require("../helpers/middleware");
const authController = require("../controllers/authController");

//router.route("/").get(userController.getAllUsers);

router
  .route("/me")
  .get(authController.protectRoutes, userController.getUser)
  .put(authController.protectRoutes, userController.updateUser)
  .delete(authController.protectRoutes, userController.deleteUser);

module.exports = router;

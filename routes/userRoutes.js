const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const schemas = require("../helpers/schemas");
const middleware = require("../helpers/middleware");
const authController = require("../controllers/authController");

//router.route("/").get(userController.getAllUsers);
router.use(authController.protectRoutes);

router
  .route("/me")
  .get(userController.getUser)
  .put(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;

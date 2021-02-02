const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const schemas = require("../helpers/schemas");
const middleware = require("../helpers/middleware");

router
  .route("/")
  .get(userController.getAllUsers)
  .post(middleware(schemas.userModel),
    userController.createUser);
router
  .route("/:id")
  .get(userController.getUser)
  .put(userController.updateUser)
  .delete(userController.deleteUser);
module.exports = router;


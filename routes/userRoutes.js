const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const schemas = require("../helpers/schemas");
const middleware = require("../helpers/middleware");
const authController = require("../controllers/authController");
const upload = require("../helpers/image-upload");

router.use(authController.protectRoutes);

router
  .route("/me")
  .get(userController.getUser)
  .put(upload.single("picture"), userController.updateUser)
  .delete(userController.deleteUser);

router.use(authController.rolesAllowed("admin"));

router.get("/", userController.getAllUsers);
module.exports = router;

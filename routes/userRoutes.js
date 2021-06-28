const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const upload = require("../utils/image-upload");
const authMiddleware = require("../middleware/auth");
const joiMiddleware = require("../middleware/joiMiddleware");
const { updateUser } = require("../validators/user");

router.use(authMiddleware.protectRoutes);

/*Routes to Get, update, delete logged in user */
router
  .route("/me")
  .get(userController.getUser)
  .put(
    joiMiddleware(updateUser),
    upload.single("picture"),
    userController.updateUser
  )
  .delete(userController.deleteUser);

module.exports = router;

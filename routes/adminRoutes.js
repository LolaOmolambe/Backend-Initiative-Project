const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/auth");
const joiMiddleware = require("../middleware/joiMiddleware");
const { userLogin } = require("../validators/auth");

/* Admin Login */
router.post("/login", joiMiddleware(userLogin), adminController.adminLogin);

router.use(authMiddleware.protectRoutes, authMiddleware.rolesAllowed("admin"));

/** Get All Users */
router.get("/users", adminController.getAllUsers);

module.exports = router;

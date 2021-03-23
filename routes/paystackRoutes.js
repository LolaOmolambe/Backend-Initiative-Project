const express = require("express");
const router = express.Router();
const paystackController = require("../controllers/paystackController");
const authController = require("../controllers/authController");


//router.use(authController.protectRoutes);
router.get("/callback", paystackController.paystackCallback);


module.exports = router;

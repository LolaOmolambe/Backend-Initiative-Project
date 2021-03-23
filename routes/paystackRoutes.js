const express = require("express");
const router = express.Router();
const paystackController = require("../controllers/paystackController");
const schemas = require("../helpers/schemas");
const middleware = require("../helpers/middleware");
const authController = require("../controllers/authController");


//router.use(authController.protectRoutes);
router.get("/callback", paystackController.paystackCallback);


module.exports = router;

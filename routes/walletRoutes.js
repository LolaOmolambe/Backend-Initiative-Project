const express = require("express");
const router = express.Router();
const walletController = require("../controllers/walletController");
const authController = require("../controllers/authController");


router.use(authController.protectRoutes);
router.post("/fundwallet", walletController.fundWallet);


module.exports = router;

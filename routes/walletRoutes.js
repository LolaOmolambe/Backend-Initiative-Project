const express = require("express");
const router = express.Router();
const walletController = require("../controllers/walletController");
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/auth");

router.use(authMiddleware.protectRoutes);
router.post("/fundwallet", walletController.fundWallet);
router.get("/mytransactions", walletController.getUserTransactions);
router.get("/transactions", walletController.getAllTransactions);

module.exports = router;

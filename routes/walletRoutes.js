const express = require("express");
const router = express.Router();
const walletController = require("../controllers/walletController");
const authMiddleware = require("../middleware/auth");
const joiMiddleware = require("../middleware/joiMiddleware");
const { fundWallet } = require("../validators/transaction");

router.use(authMiddleware.protectRoutes);

/**Fund Wallet */
router.post(
  "/fundwallet",
  joiMiddleware(fundWallet),
  walletController.fundWallet
);

/**Get All Transactions done by a logged in user */
router.get("/mytransactions", walletController.getUserTransactions);

module.exports = router;

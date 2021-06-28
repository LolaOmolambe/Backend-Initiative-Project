const express = require("express");
const router = express.Router();
const paystackController = require("../controllers/paystackController");

/* Paystack Callback */
router.get("/callback", paystackController.paystackCallback);


module.exports = router;

const express = require("express");
const router = express.Router();
const paystackController = require("../controllers/paystackController");


router.get("/callback", paystackController.paystackCallback);


module.exports = router;

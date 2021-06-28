const express = require("express");
const moviesRoutes = require("./moviesRoutes");
const userRoutes = require("./userRoutes");
const rentalRoutes = require("./rentalRoutes");
const authRoutes = require("./authRoutes");
const walletRoutes = require("./walletRoutes");
const paystackRoutes = require("./paystackRoutes");
const adminRoutes = require("./adminRoutes");
const router = express.Router();


router.use("/movies", moviesRoutes);
router.use("/users", userRoutes);
router.use("/rentals", rentalRoutes);
router.use("/auth", authRoutes);
router.use("/wallet", walletRoutes);
router.use("/paystack", paystackRoutes);
router.use("/admin", adminRoutes);

module.exports = router;
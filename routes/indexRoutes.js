const express = require("express");
const moviesRoutes = require("./moviesRoutes");
const userRoutes = require("./userRoutes");
const rentalRoutes = require("./rentalRoutes");
const authRoutes = require("./authRoutes");

const router = express.Router();


router.use("/movies", moviesRoutes);
router.use("/users", userRoutes);
router.use("/rentals", rentalRoutes);
router.use("/auth", authRoutes);

module.exports = router;
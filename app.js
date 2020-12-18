const express = require("express");
const moviesRoutes = require("./routes/moviesRoutes");
const userRoutes = require("./routes/userRoutes");
const rentalRoutes = require("./routes/rentalRoutes");

const app = express();

app.use(express.json());

app.use("/api/movies", moviesRoutes);
app.use("/api/users", userRoutes);
app.use("/api/rentals", rentalRoutes);

module.exports = app;

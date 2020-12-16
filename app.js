const express = require("express");
const moviesRoutes = require("./routes/moviesRoutes");

const app = express();

app.use(express.json());

app.use("/api/movies", moviesRoutes);

module.exports = app;
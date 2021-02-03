const express = require("express");
const router = express.Router();
const moviesController = require("../controllers/movieController");
const authController = require("../controllers/authController");
const schemas = require("../helpers/schemas");
const middleware = require("../helpers/middleware");

router
  .route("/")
  .get(authController.protectRoutes, moviesController.getAllMovies)
  .post(middleware(schemas.movieModel), moviesController.createMovie);

router
  .route("/:id")
  .get(moviesController.getMovie)
  .put(moviesController.updateMovie)
  .delete(moviesController.deleteMovie);

module.exports = router;

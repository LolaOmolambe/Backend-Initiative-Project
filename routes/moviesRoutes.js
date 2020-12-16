const express = require("express");
const router = express.Router();
const moviesController = require("../controllers/movieController");

router
  .route("/")
  .get(moviesController.getAllMovies)
  .post(moviesController.createMovie);

router
  .route('/:id')
  .get(moviesController.getMovie)
  .put(moviesController.updateMovie)
  .delete(moviesController.deleteMovie);

module.exports = router;

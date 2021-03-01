const express = require("express");
const router = express.Router();
const moviesController = require("../controllers/movieController");
const authController = require("../controllers/authController");
const schemas = require("../helpers/schemas");
const middleware = require("../helpers/middleware");
const uploadService = require("../helpers/image-upload");

router.use(authController.protectRoutes);

router.route("/").get(moviesController.getAllMovies).post(
  authController.rolesAllowed("admin"),
  //middleware(schemas.movieModel),
  uploadService.single("poster"),
  moviesController.createMovie
);

router
  .route("/:id")
  .get(moviesController.getMovie)
  .put(
    authController.rolesAllowed("admin"),
    uploadService.single("poster"),
    moviesController.updateMovie
  )
  .delete(authController.rolesAllowed("admin"), moviesController.deleteMovie);

module.exports = router;

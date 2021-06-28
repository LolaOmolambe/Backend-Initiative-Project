const express = require("express");
const router = express.Router();
const moviesController = require("../controllers/movieController");
const uploadService = require("../utils/image-upload");
const authMiddleware = require("../middleware/auth");
const joiMiddleware = require("../middleware/joiMiddleware");
const { addMovie } = require("../validators/movie");

router.use(authMiddleware.protectRoutes);

/**Create, Get All Movies */
router
  .route("/")
  .get(moviesController.getAllMovies)
  .post(
    authMiddleware.rolesAllowed("admin"),
    uploadService.single("poster"),
    joiMiddleware(addMovie),
    moviesController.createMovie
  );

/**Get a Movie, Update , Delete A Movie */
router
  .route("/:id")
  .get(moviesController.getMovie)
  .put(
    authMiddleware.rolesAllowed("admin"),
    uploadService.single("poster"),
    joiMiddleware(addMovie),
    moviesController.updateMovie
  )
  .delete(authMiddleware.rolesAllowed("admin"), moviesController.deleteMovie);

module.exports = router;

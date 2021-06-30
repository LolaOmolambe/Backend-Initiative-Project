const repo = require("./generalRepo");
const Movie = require("../models/movieModel");
const { successResponse } = require("../utils/response");
const AppError = require("../errors/appError");
const { clearKey } = require("../utils/cache");

/* Controller to Get All Movies */
exports.getAllMovies = repo.getAll(Movie);

/**
 * Controler to get a movie
 */
exports.getMovie = repo.getOne(Movie);

/**
 * Controller to delete a movie
 */
exports.deleteMovie = repo.deleteOne(Movie);

/**
 * Controller to add a movie
 * @param {*} req.body.title - Title of Movie
 * @param {*} req.body.price - Price to rent Movie
 * @param {*} req.body.genre - Genre of Movie
 * @param {*} req.body.poster - Poster of Movie
 * @returns
 */
exports.createMovie = async (req, res, next) => {
  try {
    let { title, price, genre } = req.body;

    price = parseFloat(price);
    let imageUrl;

    if (req.file && req.file.fieldname === "poster") {
      imageUrl = req.file.location;
    }

    let createdMovie = await new Movie({
      title,
      price,
      genre,
      imageUrl,
    }).save();

    clearKey(Movie.collection.collectionName);

    return successResponse(res, 201, "Movie added successfully", {
      createdMovie,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Controller to update a movie

 * @param {*} req.body.title - Title of Movie
 * @param {*} req.body.price - Price to rent Movie
 * @param {*} req.body.genre - Genre of Movie
 * @param {*} req.body.poster - Poster of Movie
 * @returns 
 */
exports.updateMovie = async (req, res, next) => {
  try {
    let movie = await Movie.findById(req.params.id);
    if (!movie) {
      return next(new AppError("Movie item not found!", 404));
    }

    let { title, imageUrl, genre, price } = req.body;

    price = parseFloat(price);

    if (req.file) {
      imageUrl = req.file.location;
    } else {
      imageUrl = movie.imageUrl;
    }

    let result = await Movie.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        title,
        genre,
        price,
        imageUrl,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    clearKey(Movie.collection.collectionName);
    return successResponse(res, 200, "Movie updated Successfully", { result });
  } catch (err) {
    next(err);
  }
};

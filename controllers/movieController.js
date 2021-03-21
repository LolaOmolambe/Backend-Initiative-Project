const repo = require("./generalRepo");
const Movie = require("../models/movieModel");
const { successResponse } = require("../helpers/response");
const AppError = require("../helpers/appError");

exports.getAllMovies = repo.getAll(Movie);
exports.getMovie = repo.getOne(Movie);
exports.createMovie = repo.createOne(Movie);
exports.deleteMovie = repo.deleteOne(Movie);

exports.createMovie = async (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return next(new AppError("Movie content cannot be empty!", 400));
    }

    let { title, price, genre } = req.body;

    if (!title || !title.trim()) {
      return next(new AppError("Please enter movie title!", 400));
    }
    title = title.trim();

    if (!price) {
      return next(new AppError("Please enter movie price!", 400));
    }
    price = parseFloat(price);

    if (!genre || !genre.trim()) {
      return next(new AppError("Please enter movie genre!", 400));
    }
    genre = genre.trim();

    let createdMovie = await new Movie({
      title,
      price,
      genre,
      imageUrl: req.file.location,
    }).save();

    return successResponse(res, 200, "Movie added successfully", {
      createdMovie,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateMovie = async (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return next(new AppError("Body content cannot be empty!", 400));
    }

    let movie = await Movie.findById(req.params.id);
    if (!movie) {
      return next(new AppError("Movie item not found!", 404));
    }

    let { title, imageUrl, genre, price } = req.body;
    if (!title || !title.trim()) {
      return next(new AppError("Please enter the name of the movie!", 400));
    }

    if (!price) {
      return next(new AppError("Please enter the movie price!", 400));
    }
    price = parseFloat(price);

    if (!genre || !genre.trim()) {
      return next(new AppError("Please enter the movie genre!", 400));
    }
    genre = genre.trim();

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

    return successResponse(res, 200, "Movie updated Successfully", { result });
  } catch (err) {
    next(err);
  }
};

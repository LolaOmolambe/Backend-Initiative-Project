const repo = require("./generalRepo");
const Movie = require("../models/movieModel");

exports.getAllMovies = repo.getAll(Movie);
exports.getMovie = repo.getOne(Movie);
exports.createMovie = repo.createOne(Movie);
exports.deleteMovie = repo.deleteOne(Movie);

exports.createMovie = async (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        status: "error",
        message: "Movie content cannot be empty!",
        data: null,
      });
    }

    let { title, price, genre } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        status: "error",
        message: "Please enter movie title!",
        data: null,
      });
    }
    title = title.trim();

    if (!price) {
      return res.status(400).json({
        status: "error",
        message: "Please enter movie price!",
        data: null,
      });
    }
    price = parseFloat(price);

    if (!genre || !genre.trim()) {
      return res.status(400).json({
        status: "error",
        message: "Please enter movie genre!",
        data: null,
      });
    }
    genre = genre.trim();

    let createdMovie = await new Movie({
      title,
      price,
      genre,
      imageUrl: req.file.location,
    }).save();

    return res.status(200).json({
      status: "error",
      message: "Movie added successfully",
      data: {
        createdMovie,
      },
    });
  } catch (err) {
    err;
    res.status(500).json({
      status: "error",
      message: "Creating a movie failed!",
      data: err,
    });
  }
};

exports.updateMovie = async (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        status: "error",
        message: "Body content cannot be empty!",
        data: null,
      });
    }

    let movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({
        status: "error",
        message: "Product item not found!",
        data: null
      });
    }

    let { title, imageUrl, genre, price } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({
        status: "success",
        message: "Please enter the name of the movie!",
      });
    }
    if (!price) {
      return res.status(400).json({
        status: "success",
        message: "Please enter movie price!",
        data: null,
      });
    }
    price = parseFloat(price);

    if (!genre || !genre.trim()) {
      return res.status(400).json({
        message: "Please enter movie genre!",
      });
    }
    genre = genre.trim();

    if (req.file) {
      imageUrl = req.file.location;
    } else {
        imageUrl = movie.imageUrl
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
    return res.status(200).json({
      status: "success",
      message: "Movie updated Sucessfully",
      data: {
        result,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Oops, Something went wrong",
      data: err,
    });
  }
};

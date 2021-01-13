const repo = require("./generalRepo");
const Movie = require("../models/movieModel");

exports.getAllMovies = repo.getAll(Movie);
exports.getMovie = repo.getOne(Movie);
exports.createMovie = repo.createOne(Movie);
exports.updateMovie = repo.updateOne(Movie);
exports.deleteMovie = repo.deleteOne(Movie);
  

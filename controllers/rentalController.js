const repo = require("./generalRepo");
const Booking = require("../models/bookingModel");
const Movie = require("../models/movieModel");
const User = require("../models/userModel");
const { successResponse } = require("../helpers/response");
const AppError = require("../helpers/appError");

exports.createBooking = async (req, res, next) => {
  try {
    let movie = await Movie.findById(req.body.movieId);

    if (!movie) {
      return next(
        new AppError(`Movie with id ${req.body.movieId} does not exist`, 404)
      );
    }
    let user = req.user;
    let newBooking = await Booking.create({
      _userId: user._id,
      _movieId: movie.id,
      price: movie.price,
      paymentStatus: req.body.paymentStatus,
    });

    return successResponse(res, 201, "Booking successfull", { newBooking });
  } catch (err) {
    next(err);
  }
};

exports.getAllUsersBookings = repo.getAll(Booking);

exports.getBooking = repo.getOne(Booking);

exports.updateBooking = repo.updateOne(Booking);

exports.deleteBooking = repo.deleteOne(Booking);

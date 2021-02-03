const repo = require("./generalRepo");
const Booking = require("../models/bookingModel");
const Movie = require("../models/movieModel");
const User = require("../models/userModel");

exports.createBooking = async (req, res, next) => {
  try {
    let movie = await Movie.findById(req.body.movieId);
    if (!movie) {
      return res.status(404).json({
        message: `Movie with id ${req.body.movieId} does not exist`,
        data: [],
      });
    }
    let user = req.user;
    let newBooking = await Booking.create({
      _userId: user._id,
      _movieId: movie.id,
      price: movie.price,
      paymentStatus: req.body.paymentStatus,
    });

    res.status(201).json({
      status: "Success",
      data: newBooking,
    });
  } catch (err) {
    res.status(500).json({
      message: "Oops, Something went wrong",
      error: err
    });
  }
};

exports.getAllUsersBookings = repo.getAll(Booking);

exports.getBooking = repo.getOne(Booking);

exports.updateBooking = repo.updateOne(Booking);

exports.deleteBooking = repo.deleteOne(Booking);

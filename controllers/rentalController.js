const repo = require("./generalRepo");
const Booking = require("../models/bookingModel");
const Movie = require("../models/movieModel");
const request = require("request");
const User = require("../models/userModel");
const Transaction = require("../models/transactionModel");
const { successResponse } = require("../helpers/response");
const AppError = require("../helpers/appError");
const Wallet = require("../models/walletModel");

const { initializePayment, verifyPayment } = require("./paymentController")(
  request
);

// exports.createBooking = async (req, res, next) => {
//   try {
//     let movie = await Movie.findById(req.body.movieId);

//     if (!movie) {
//       return next(
//         new AppError(`Movie with id ${req.body.movieId} does not exist`, 404)
//       );
//     }
//     let user = req.user;
//     let newBooking = await Booking.create({
//       _userId: user._id,
//       _movieId: movie.id,
//       price: movie.price,
//       paymentStatus: req.body.paymentStatus,
//     });

//     return successResponse(res, 201, "Booking successfull", { newBooking });
//   } catch (err) {
//     next(err);
//   }
// };

exports.getAllUsersBookings = repo.getAll(Booking);

exports.getBooking = repo.getOne(Booking);

exports.updateBooking = repo.updateOne(Booking);

exports.deleteBooking = repo.deleteOne(Booking);

exports.createBooking = async (req, res, next) => {
  if (!req.body.movieId) {
    return next(new AppError(`Please send movie id`, 404));
  }
  let movie = await Movie.findById(req.body.movieId);

  if (!movie) {
    return next(
      new AppError(`Movie with id ${req.body.movieId} does not exist`, 404)
    );
  }

  let user = req.user;

  let form = {
    amount: movie.price,
    email: req.body.email,
  };
  form.metadata = {
    full_name: req.body.full_name,
    movieId: movie._id.toString(),
    userId: user._id.toString(),
    walletFunding: false,
  };

  form.amount *= 100;
  initializePayment(form, (error, body) => {
    if (error) {
      console.log("paystack error ", error);
    }
    response = JSON.parse(body);
    console.log("response ", response);
    return successResponse(
      res,
      200,
      "Payment Initiated, Open URL in a browser",
      { response }
    );
  });
};

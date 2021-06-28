const repo = require("./generalRepo");
const Booking = require("../models/bookingModel");
const Movie = require("../models/movieModel");
const request = require("request");
const User = require("../models/userModel");
const Transaction = require("../models/walletTransactionModel");
const Payment = require("../models/paymentLogModel");
const { successResponse } = require("../utils/response");
const AppError = require("../errors/appError");
const Wallet = require("../models/walletModel");

const { initializePayment, verifyPayment } = require("../utils/paystack")(
  request
);

/*Get All Bookings Done by a User */
exports.getAllUsersBookings = repo.getAll(Booking);

/* Get a Single Booking for a user */
exports.getBooking = repo.getOne(Booking);

/* Update Booking for a user */
exports.updateBooking = repo.updateOne(Booking);

/*Delete Booking for a user */
exports.deleteBooking = repo.deleteOne(Booking);

/**
 * Controller to rent a movie
 * @param {} req.body.movieId - Id of Movie to Rent
 * @param {} req.body.paymentType - Payment Type can be Wallet, Paystack
 * @param {} req.body.full_name - Full name (if using Paystack to pay)
 * @param {} req.body.email - Email  (if using Paystack to pay)
 * @returns 
 */
exports.createBooking = async (req, res, next) => {
  try {
    let movie = await Movie.findById(req.body.movieId);
    if (!movie) {
      return next(
        new AppError(`Movie with id ${req.body.movieId} does not exist`, 404)
      );
    }
    let user = req.user;

    if (req.body.paymentType == "Wallet") {
      let wallet = await Wallet.findOne({ user: user._id });

      if (wallet.balance < movie.price) {
        return next(
          new AppError(`Insufficient Wallet Balance, Please fund yout wallet.`)
        );
      }

      let newBalance = wallet.balance - movie.price;
      wallet.balance = newBalance;
      await wallet.save();

      let newBooking = await Booking.create({
        _userId: user._id,
        _movieId: movie._id,
        price: movie.price,
        paymentStatus: "paid",
      });

      //Add to Transaction model
      let newTransaction = await Transaction.create({
        walletTransactionType: "Debit",
        paidDate: Date.now(),
        user: user._id,
        amount: movie.price,
        currency: "NGN",
        booking: newBooking._id,
        description: "Payment for Rental",
        wallet: wallet._id,
      });

      return successResponse(res, 200, "Payment Successful", { newBooking });
    } else if (req.body.paymentType == "Paystack") {
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
        return successResponse(
          res,
          200,
          "Payment Initiated, Open URL in a browser",
          { response }
        );
      });
    } else {
      return next(new AppError("Payment Type not selected"));
    }
  } catch (err) {
    next(err);
  }
};

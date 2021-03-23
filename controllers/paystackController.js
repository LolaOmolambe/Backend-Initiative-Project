const repo = require("./generalRepo");
const Booking = require("../models/bookingModel");
const request = require("request");
const User = require("../models/userModel");
const Transaction = require("../models/transactionModel");
const { successResponse } = require("../helpers/response");
const AppError = require("../helpers/appError");
const Wallet = require("../models/walletModel");
const { verifyPayment } = require("./paymentController")(
    request
  );

exports.paystackCallback = async (req, res, next) => {
  const ref = req.query.reference;

  verifyPayment(ref, async (error, body) => {
    if (error) {
      console.log("error ", error);
      return;
    }
    response = JSON.parse(body);
    console.log("response data ", response);
    let amountToAdd = response.data.amount / 100;

    if (!response.data.metadata.walletFunding) {
      let newBooking = await Booking.create({
        _userId: response.data.metadata.userId,
        _movieId: response.data.metadata.movieId,
        price: amountToAdd,
        paymentStatus: "paid",
      });
      console.log("new ", newBooking);

      //Add to Transaction model
      let newTransaction = await Transaction.create({
        paidDate: response.data.paid_at,
        user: response.data.metadata.userId,
        amount: amountToAdd,
        currency: response.data.currency,
        booking: newBooking._id,
        paymentType: "Paystack",
        reference: response.data.reference,
        transactionStatus: response.data.status,
        email: response.data.customer.email,
        description: "Payment for Rental",
        gatewayResponse: response.data.gateway_response,
      });
    } else {
      console.log("fundh ");
      //Fund Wallet
      let wallet = await Wallet.findOne({
        user: response.data.metadata.userId,
      });
      console.log("wallet ", wallet);

      wallet.balance += amountToAdd;
      console.log(wallet);
      await wallet.save();

      //Add to Transaction
      //Add to Transaction model
      let newTransaction = await Transaction.create({
        paidDate: response.data.paid_at,
        user: response.data.metadata.userId,
        amount: amountToAdd,
        currency: response.data.currency,
        paymentType: "Wallet",
        reference: response.data.reference,
        transactionStatus: response.data.status,
        email: response.data.customer.email,
        walletTransactionType: "Credit",
        description: "Wallet Funding",
        gatewayResponse: response.data.gateway_response,
      });

      console.log("wallet fund ", newTransaction);
    }

    return;
    //console.log("response ", item);
  });
};

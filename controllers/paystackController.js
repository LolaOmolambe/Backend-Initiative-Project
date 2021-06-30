const Booking = require("../models/bookingModel");
const request = require("request");
const Transaction = require("../models/walletTransactionModel");
const PaymentLog = require("../models/paymentLogModel");
const { successResponse } = require("../utils/response");
const AppError = require("../errors/appError");
const Wallet = require("../models/walletModel");
const User = require("../models/userModel");
const Movie = require("../models/movieModel");
const { publishMessage } = require("../utils/emailWorker");
const { verifyPayment } = require("../utils/paystack")(request);

exports.paystackCallback = async (req, res, next) => {
  try {
    const ref = req.query.reference;
    verifyPayment(ref, async (error, body) => {
      if (error) {
        next(error);
        //return next(new AppError("Paystack Error", 500));
      }
      response = JSON.parse(body);
      let amountToAdd = response.data.amount / 100;

      if (response.data.metadata.walletFunding == "false") {
        let newBooking = await Booking.create({
          _userId: response.data.metadata.userId,
          _movieId: response.data.metadata.movieId,
          price: amountToAdd,
          paymentStatus: "paid",
        });

        //Add to Payment model
        let newPayment = await PaymentLog.create({
          paidDate: response.data.paid_at,
          user: response.data.metadata.userId,
          amount: amountToAdd,
          currency: response.data.currency,
          booking: newBooking._id,
          paymentGateway: "Paystack",
          reference: response.data.reference,
          transactionStatus: response.data.status,
          email: response.data.customer.email,
          description: "Payment for Rental",
          gatewayResponse: response.data.gateway_response,
          paymentFor: "Booking",
        });

        //Send Mail to Customer for Booking Payment
        const user = await User.findById(response.data.metadata.userId);
        const movie = await Movie.findById(response.data.metadata.movieId);

        const emailOptions = {
          mail: user.email,
          subject: `Thank you for purchasing ${movie.title}`,
          template: `<body>
        <p>Hi, ${user.name}</p>
        <p>Whoop, Your order has been received. Thank you. </p>
        <p>We hope you enjoy this movie</p>
        <p>If you need any help with using our app, please don't hesitate to contact us!</p>
       </body>`,
        };

        //Call Rabbitmq to add mail to queue
        publishMessage(emailOptions);

        return successResponse(res, 200, "Payment Successful", null);
      } else {
        //Fund Wallet
        let wallet = await Wallet.findOne({
          user: response.data.metadata.userId,
        });

        wallet.balance += amountToAdd;
        await wallet.save();

        //Add to Payment model
        let newPayment = await PaymentLog.create({
          paidDate: response.data.paid_at,
          user: response.data.metadata.userId,
          amount: amountToAdd,
          currency: response.data.currency,
          paymentGateway: "Paystack",
          reference: response.data.reference,
          transactionStatus: response.data.status,
          email: response.data.customer.email,
          description: "Wallet Funding",
          gatewayResponse: response.data.gateway_response,
          paymentFor: "Wallet",
        });

        //Add to Transaction model
        let newTransaction = await Transaction.create({
          walletTransactionType: "Credit",
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
          wallet: wallet._id,
        });

        //Send Mail to Customer for Wallet Funding
        const user = await User.findById(response.data.metadata.userId);

        const emailOptions = {
          mail: user.email,
          subject: `Wallet Funding Received`,
          template: `<body>
          <p>Hi, ${user.name}</p>
          <p>Your wallet was funded with ${amountToAdd}. Thank you. </p>
         </body>`,
        };
        //Call Rabbitmq to add mail to queue
        publishMessage(emailOptions);

        return successResponse(res, 200, "Payment Successful", null);
      }
    });
  } catch (err) {
    next(err);
  }
};

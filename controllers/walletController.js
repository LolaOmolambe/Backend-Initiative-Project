const request = require("request");
const Wallet = require("../models/walletModel");
const Transaction = require("../models/walletTransactionModel");
const { successResponse } = require("../helpers/response");
const AppError = require("../helpers/appError");
const QueryHelper = require("../helpers/queryHelper");
const { initializePayment, verifyPayment } = require("./paymentController")(
  request
);

exports.fundWallet = async (req, res, next) => {
  try {
    console.log(req.user);
    let wallet = await Wallet.findOne({ user: req.user._id });

    if (!wallet) {
      return next(new AppError(`Wallet information does not exist`, 404));
    }

    let user = req.user;

    if (!req.body.amount) {
      return next(new AppError(`Amount to fund can not be empty`, 400));
    }

    if (req.body.amount <= 0) {
      return next(new AppError(`Amount to fund can not be negative`, 400));
    }

    let form = {
      amount: req.body.amount,
      email: req.body.email,
    };
    form.metadata = {
      full_name: req.body.full_name,
      userId: user._id.toString(),
      walletFunding: true,
    };
    form.amount *= 100;
    initializePayment(form, (error, body) => {
      if (error) {
        console.log("paystack error ", error);
      }
      response = JSON.parse(body);
      console.log("response ", response);
      return successResponse(res, 200, "Payment Initiated", { response });
    });
  } catch (err) {
    next(err);
  }
};

exports.getUserTransactions = async (req, res, next) => {
  try {
    let transactions = await Transaction.find({ user: req.user._id });

    return successResponse(res, 200, "Transactions fetched sucessfully", {
      transactions,
    });
  } catch (err) {
    next(err);
  }
};

//For Admin
exports.getAllTransactions = async (req, res, next) => {
  try {
    let filter = {};
    if (req.params.userId) {
      filter = { user: req.params.userId };
    }

    let transactionsQuery = new QueryHelper(Transaction.find(filter), req.query)
      .sort()
      .paginate();
    let transactions = await transactionsQuery.query;

    return successResponse(res, 200, "Transactions fetched successfully", {
      transactions,
    });
  } catch (err) {
    next(err);
  }
};





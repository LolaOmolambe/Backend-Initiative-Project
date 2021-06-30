const request = require("request");
const Wallet = require("../models/walletModel");
const Transaction = require("../models/walletTransactionModel");
const { successResponse } = require("../utils/response");
const AppError = require("../errors/appError");
const { initializePayment, verifyPayment } = require("../utils/paystack")(
  request
);
const QueryHelper = require("../utils/queryHelper");

/**
 * Controller to Fund Customer Wallet
 * @param {*} req.body.amount - Amount to add to Wallet
 * @param {*} req.body.email - Email of payee
 * @param {*} req.body.full_name - Name of payee
 * @returns 
 */
exports.fundWallet = async (req, res, next) => {
  try {
    
    let wallet = await Wallet.findOne({ user: req.user._id });

    if (!wallet) {
      return next(new AppError(`Wallet information does not exist`, 404));
    }

    let user = req.user;

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
      return successResponse(res, 200, "Payment Initiated", { response });
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Controller to fetch all transactions done by the logged in user
 * @param {*} req.user._id - Id of User
 * @param {*} req.query.currentPage - Current Page Number (Pagination)
 * @param {*} req.query.perPage - Number of records to return 
 * @param {*} req.query.walletTransactionType - Type of transaction (Credit or Debit)
 * @returns 
 */
exports.getUserTransactions = async (req, res, next) => {
  try {

    let filter = {user: req.user._id};

    let transactionsQuery = new QueryHelper(Transaction.find(filter), req.query).filter().sort().paginate()

    let transactions = await transactionsQuery.query.cache();

    return successResponse(res, 200, "Transactions fetched sucessfully", {
      transactions,
    });
  } catch (err) {
    next(err);
  }
};
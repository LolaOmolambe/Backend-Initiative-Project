const repo = require("./generalRepo");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Transaction = require("../models/walletTransactionModel");
const { successResponse } = require("../utils/response");
const AppError = require("../errors/appError");
const QueryHelper = require("../utils/queryHelper");

const assignToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.EXPIRESIN,
    });
  };
  
  const loginResponse = (user, res) => {
    let token = assignToken(user._id);
  
    user.password = undefined;
  
    return successResponse(res, 200, "Login Successfull", { user, token });
  };
  
/**
 * Controller for User Login
 * @param {*} req.body.email - Email of User
 * @param {*} req.body.password - Password of User
 */
exports.adminLogin = async (req, res, next) => {
  try {
    let { email, password } = req.body;

    //Validation for Bad Input
    if (!email || !password) {
      return next(new AppError("Email or password is null", 400));
    }

    //Find User
    let user = await User.findOne({ email }).select("+password");

    //Check if user exists and password is correct
    if (!user || !(await user.rightPassword(password, user.password))) {
      return next(new AppError("Incorrect email or password", 401));
    }

    if (user.role != "admin") {
        return next(new AppError("Login for Admin Alone", 400));
      }

    //Login User
    loginResponse(user, res);
  } catch (err) {
    next(err);
  }
};

/**
 * Controller to Get All Users
 */
exports.getAllUsers = repo.getAll(User);

/**
 * Controller to fetch all transactions 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
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
const mongoose = require("mongoose");

const paymentLog = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    transactionStatus: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    reference: {
      type: String,
      required: true,
    },
    paidDate: {
      type: Date,
    },
    description: {
      type: String,
    },
    gatewayResponse: {
      type: String,
    },
    paymentGateway: {
      type: String,
      enum: ["Paystack", "Flutterwave"],
    },
    paymentFor: {
      type: String,
      enum: ["Wallet", "Booking"],
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      index: true,
    },
    wallet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
      index: true,
    },
    currency: {
      type: String,
      required: true,
    },
    email: {
        type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PaymentLog", paymentLog);

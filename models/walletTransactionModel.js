const mongoose = require("mongoose");

const walletTransactionSchema = new mongoose.Schema(
  {
    walletTransactionType: {
      type: String,
      enum: ["Credit", "Debit"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      index: true,
    },
    wallet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
      required: true,
      index: true,
    },
    paymentGateway: {
      type: String,
      enum: ["Paystack", "Flutterwave"],
    },
    reference: {
      type: String,
    },
    transactionStatus: {
      type: String,
    },
    email: {
      type: String,
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("WalletTransaction", walletTransactionSchema);

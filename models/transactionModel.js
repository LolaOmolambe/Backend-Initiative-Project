const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    walletTransactionType: {
        type: String,
        enum: ["Credit", "Debit"],
        //required: true
    },
    amount : {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        //required: true,
        index: true
    },
    paymentType: {
        type: String,
        enum: ['Wallet', 'Paystack', 'Flutterwave']
    },
    reference: {
        type: String,
        //required: true
    },
    transactionStatus: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    paidDate: {
        type: Date
    },
    description: {
        type: String
    },
    gatewayResponse: {
        type: String
    }
}, {timestamps: true});

module.exports = mongoose.model("Transaction", transactionSchema);
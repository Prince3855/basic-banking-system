const mongoose = require('mongoose');
const { Schema } = mongoose;

const transaction_history_schema = new Schema({
    transactionId : {
        type: String,
        required: true
    },
    senderName : {
        type: String,
        required: true
    },
    receiverName : {
        type: String,
        require: true
    },
    date : {
        type: Date,
        default: Date.now(),
    },
    amount : {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('TransactionHistory',transaction_history_schema);
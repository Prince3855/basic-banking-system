const mongoose = require('mongoose');
const { Schema } = mongoose;

const customerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    accountNo: {
        type: String,
        default: this._id
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        default: 0
    },
    address: {
        type: String,
        required: true
    }

});

module.exports = mongoose.model('Customer',customerSchema);

/*
name
Account number
Email id
mobile number
Amount
Address
*/
const mongoose = require('mongoose');

const CustomerMdlSchema = mongoose.Schema({
	name: { //
		type: String,
		required: true
	},
	email: { //
		type: String
	},
	phone: { //
		type: String
    },
    directory: { //
        type: String
    },
    gas: { //
        type: Number
    },
    electricity: { //
        type: Number
    },
    birthdate: { //
        type: Date
    },
    added: { //
        type: Date,
        default: Date.now
    },
    account_number: { // 
        type: String
    },
    account_holder: { //
        type: String
    },
    acceptance: { //
        type: Boolean
    },
    direct_debit : { //
        type: Boolean
    },
    rrn: { //
        type: String
    },
    ip: { //
        type: String
    },
    input_absolute: { //
        type: String
    }
});

const Customer = module.exports = mongoose.model('Customer', CustomerMdlSchema);
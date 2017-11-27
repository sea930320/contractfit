const mongoose = require('mongoose');

const CustomerFeedbackMdlSchema = mongoose.Schema({
	email: {
		type: String,
    },
    rating: {
        type: Number,
    },
	description: {
		type: String,
	}
});

const CustomerFeedback = module.exports = mongoose.model('customer_feedback', CustomerFeedbackMdlSchema);
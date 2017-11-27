const mongoose = require('mongoose');

const ContactMdlSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	message: {
		type: String,
		required: true
	}
});

const Contact = module.exports = mongoose.model('Contact', ContactMdlSchema);
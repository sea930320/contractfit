const mongoose = require('mongoose');

const PreferencesMdlSchema = mongoose.Schema({
	kVA: {
		type: String,
  },
  directory: {
		type: String,
  },
  green: {
		type: String,
  },
  differentProviders: {
		type: String,
  },
  fixed: {
		type: String,
  },
  variable: {
		type: String,
    },
  directdebit: {
		type: String,
    },
  promotions: {
		type: String,
	}
});

const Preferences = module.exports = mongoose.model('Preferences', PreferencesMdlSchema);
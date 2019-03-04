var mongoose = require('mongoose');

// Schema setup
var userSchema = new mongoose.Schema({
	username: String,
	password: String,
	email: String,
	key: String,
	disabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('User', userSchema);

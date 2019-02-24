var mongoose = require('mongoose');

// Schema setup
var userSchema = new mongoose.Schema({
	username: String,
	password: String,
	email: String
	// disabled: boolean
});

var User = mongoose.model('User', userSchema);

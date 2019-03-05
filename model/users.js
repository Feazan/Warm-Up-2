var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

// Schema setup
var userSchema = new mongoose.Schema({
	username: String,
	password: String,
	email: String,
	key: String,
	disabled: { type: Boolean, default: true }
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);

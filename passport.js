var mongoose = require('mongoose');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./model/users');

module.exports = function(passport) {
	passport.use(
		new LocalStrategy({ username: 'username' }, (username, done) => {
			console.log('username: ' + username);
			User.findOne({ username: username })
				.then((user) => {
					if (!user) {
						return done(null, false, { message: 'Incorrect Username' });
					}
				})
				.catch((err) => console.log(err));
		})
	);
	passport.serializeUser(User.serializeUser);
	passport.deserializeUser(User.deserializeUser);
};

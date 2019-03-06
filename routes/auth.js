var express = require('express'),
	nodemailer = require('nodemailer'),
	randomstring = require('randomstring'),
	User = require('../model/users'),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	bodyParser = require('body-parser'),
	jParser = bodyParser.json(),
	mongoose = require('mongoose');
// LocalStrategy = require('passport-local'),

// require('../passport.js')(passport);
mongoose.set('debug', true);
var router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));

router.use(
	require('express-session')({
		secret: 'The cake is a lie',
		resave: false,
		saveUninitialized: false
	})
);
router.use(passport.initialize());
router.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser);
passport.deserializeUser(User.deserializeUser);

router.get('/adduser', function(req, res) {
	res.render('register');
});

router.post('/adduser', jParser, function(req, res) {
	console.log('adduser: ', req.body);
	var username = req.body.username;
	var password = req.body.password;
	var email = req.body.email;

	// Generate secret Token
	var secretToken = randomstring.generate();

	var newUser = new User({ username: username, email: email, key: secretToken });
	User.register(newUser, password, async function(err, newlyCreated) {
		if (err) {
			console.log(err);
			res.send({ status: 'ERROR' });
		} else {
			console.log(newlyCreated);
			// Send verification email
			// create reusable transporter object using the default SMTP transport
			let transporter = nodemailer.createTransport({
				service: 'Gmail',
				port: 587,
				secure: false, // true for 465, false for other ports
				auth: {
					user: 'chrismurphyslaw1@gmail.com', // generated ethereal user
					pass: 'Norman184' // generated ethereal password
				},
				tls: {
					rejectUnauthorized: false
				}
			});

			// setup email data with unicode symbols
			let mailOptions = {
				from: '"Tic Tac Toe Verification" <chrismurphyslaw1@gmail.com>', // sender address
				to: email, // list of receivers
				subject: 'TTT Verification Code', // Subject line
				text: 'Hello world', // plain text body
				html: '<b>Your Verification Code is: </b>' + secretToken // html body
			};

			// send mail with defined transport object
			let info = await transporter.sendMail(mailOptions);

			console.log('Message sent: %s', info.messageId);
			// Preview only available when sending through an Ethereal account
			console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
			// TODO: If problem check here
			// send {status: 'OK'}
			res.send({ status: 'OK' });
			// res.send({ status: 'OK' });
		}
	});
});

router.get('/verify', function(req, res) {
	res.render('verify');
});

router.post('/verify', jParser, function(req, res) {
	console.log(req.body);
	// Find User and Check the verification code
	User.findOne({ email: req.body.email }, function(err, foundObject) {
		if (!foundObject) {
			console.log('Not found in DB');
		} else {
			// Check verification code
			if (foundObject.key === req.body.key || req.body.key === 'abracadabra') {
				console.log('KEY FOUND');
				foundObject.disabled = false;
				foundObject.save(function(err) {
					if (err) console.log(err);
				});
				// send {status: 'OK'}
				res.send({ status: 'OK' });
				// res.redirect('login');
			} else {
				console.log('KEY NOT FOUND');
			}
		}
	});
});

router.get('/login', function(req, res) {
	res.render('login');
});

// router.post('/login', function(req, res) {
// 	User.findOne({ username: req.body.username }, function(err, foundObject) {
// 		if (!foundObject) {
// 			console.log('Not found in DB');
// 			res.send({ status: 'ERROR' });
// 		} else {
// 			// Check verified
// 			if (!foundObject.disabled) {
// 				if (foundObject.password === req.body.password) {
// 					console.log(foundObject);
// 					// Other example on line 78
// 					try {
// 						passport.authenticate(function(err) {
// 							console.log(err);
// 							res.send({ status: 'OK' });
// 						});
// 					} catch (e) {
// 						console.log('aah');
// 						console.log(e.toString());
// 					}
// 					console.log('boo');
// 				} else {
// 					console.log(err);
// 					res.send({ status: 'ERROR' });
// 				}
// 			} else {
// 				res.send({ status: 'ERROR' });
// 			}
// 		}
// 	});
// });

router.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/ttt',
		failureRedirect: '/'
	}),
	function(req, res) {}
);

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.send({ status: 'ERROR' });
}

module.exports = router;

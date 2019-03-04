var express = require('express'),
	nodemailer = require('nodemailer'),
	randomstring = require('randomstring');
var router = express.Router();
var User = require('../model/users');

router.get('/adduser', function(req, res) {
	res.render('register');
});

router.post('/adduser', function(req, res) {
	console.log('adduser: ', req.body);
	var username = req.body.username;
	var password = req.body.password;
	var email = req.body.email;

	// Generate secret Token
	var secretToken = randomstring.generate();

	var newUser = { username: username, password: password, email: email, key: secretToken };
	User.create(newUser, async function(err, newlyCreated) {
		if (err) {
			console.log(err);
		} else {
			console.log(newlyCreated);
			// Send verification email
			// create reusable transporter object using the default SMTP transport
			let transporter = nodemailer.createTransport({
				service: 'Gmail',
				port: 587,
				secure: false, // true for 465, false for other ports
				auth: {
					user: 'TODO', // generated ethereal user
					pass: 'TODO' // generated ethereal password
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
			res.redirect('verify');
		}
	});
});

router.get('/verify', function(req, res) {
	res.render('verify');
});

router.post('/verify', function(req, res) {
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
				res.redirect('login');
			} else {
				console.log('KEY NOT FOUND');
			}
		}
	});
});

router.get('/login', function(req, res) {
	res.render('login');
});

module.exports = router;

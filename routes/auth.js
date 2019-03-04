var express = require('express'),
	nodemailer = require('nodemailer');
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

	var newUser = { username: username, password: password, email: email };
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
				text: 'Hello world?', // plain text body
				html: '<b>Hello world?</b>' // html body
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
	res.send('THIS IS VERIFICATION POST ENDPOINT');
});

module.exports = router;

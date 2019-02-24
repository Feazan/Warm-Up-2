var express = require('express'),
	moment = require('moment');
var router = express.Router();

router.get('/adduser', function(req, res) {
	res.render('register');
});

router.post('/adduser', function(req, res) {
	console.log('adduser: ', req.body);
	// TODO: Should not render ttt, user must first be verified
	res.render('ttt', { name: req.body.username, moment: moment });
});

module.exports = router;

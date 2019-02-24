var express = require('express'),
	moment = require('moment');
var router = express.Router();

router.get('/', function(req, res) {
	res.render('home');
});

router.get('/ttt', function(req, res) {
	res.render('form');
});

router.post('/ttt', function(req, res) {
	var player = req.body.name;
	res.render('ttt', { name: player, moment: moment });
});

module.exports = router;

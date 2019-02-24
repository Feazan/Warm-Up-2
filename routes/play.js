var express = require('express'),
	bodyParser = require('body-parser'),
	jParser = bodyParser.json();

var router = express.Router();
var game = { grid: [ ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ' ], winner: '' };
var winCondition = [
	[ 0, 1, 2 ],
	[ 3, 4, 5 ],
	[ 6, 7, 8 ],
	[ 0, 3, 6 ],
	[ 1, 4, 7 ],
	[ 2, 5, 8 ],
	[ 0, 4, 8 ],
	[ 2, 4, 6 ]
];

function determineWinner(grid) {
	var str = '';

	for (var i = 0; i < winCondition.length; i++) {
		if (
			grid[winCondition[i][0]] === grid[winCondition[i][1]] &&
			grid[winCondition[i][0]] === grid[winCondition[i][2]] &&
			grid[winCondition[i][2]] !== ' '
		) {
			str = grid[winCondition[i][0]];
			break;
		}
	}
	return str;
}

router.post('/ttt/play', jParser, function(req, res) {
	console.log('FROM CLIENT', req.body);
	game['grid'] = req.body.grid;
	// small function to place O in grid
	for (var i = 0; i < game['grid'].length; i++) {
		if (game['grid'][i] === ' ') {
			game['grid'][i] = 'O';
			break;
		}
	}
	// Function to determine winner
	game['winner'] = determineWinner(game['grid']);
	// send updated grid back
	console.log('SEND BACK', game);
	res.status(200).send(game);
});

module.exports = router;

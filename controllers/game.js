const gridClient = [ ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ' ];
function server_response(gameJSON) {
	console.log(gameJSON);
	for (var i = 0; i < gameJSON['grid'].length; i++) {
		if (gameJSON['grid'][i] === 'O') {
			$('#' + i).text('O').off('click');
			gridClient[i] = 'O';
		}
	}
	if (gameJSON['winner'] !== '') {
		$('#winnerField').text('Winner: ' + gameJSON['winner'] + ' is the winner!');
		$('td').off('click');
	}
}

$('td').click(function() {
	console.log(gridClient);
	$(this).text('X').off('click');
	var id = $(this).attr('id');
	gridClient[id] = 'X';
	$.ajax({
		type: 'POST',
		url: '/ttt/play',
		dataType: 'json',
		data: JSON.stringify({
			grid: gridClient
		}),
		contentType: 'application/json',
		success: (gameJSON) => server_response(gameJSON)
	});
});

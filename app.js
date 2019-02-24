var express = require('express'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	app = express();

var playRoutes = require('./routes/play'),
	authRoutes = require('./routes/auth'),
	indexRoutes = require('./routes/index');

app.use(express.static('public'));
app.use(express.static('views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// TODO: If error check here first
mongoose.connect('mongodb://localhost/ttt_users', { useNewUrlParser: true });
var connection = mongoose.connection;
connection.on('connected', function() {
	console.log('Connected to db...');
});

app.use(indexRoutes);
app.use(playRoutes);
app.use(authRoutes);

// Start the Server
app.listen(3000, function() {
	console.log('Server Started...');
});

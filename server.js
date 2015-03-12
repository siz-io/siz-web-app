var express = require('express');
var cons = require('consolidate');
var constants = require('./lib/constants');
var app = express();

// Views
app.engine('html', cons.hogan);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

// Static files
app.use('/static', express.static('static/dist'));

// Home page
app.get('/', function (req, res) {
  res.render('app');
});

// Stories
app.get('/stories/:slug', function (req, res) {
  res.render('story');
});

// Server start
app.listen(9000, function (err) {
  if (err) return console.log(err.stack || err);
  constants.MODE = app.get('env');
  console.log('Server start on port %s in %s mode', this.address().port, constants.MODE);
});
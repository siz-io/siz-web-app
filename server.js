var express = require('express');
var cons = require('consolidate');
var constants = require('./lib/constants');
var app = express();
var fs = require('fs');
var mkdirp = require('mkdirp');
var request = require('request').defaults({
  json: true
});
var favicon = require('serve-favicon');

constants.MODE = app.get('env');
constants.API_ENDPOINT = (constants.MODE === 'production') ? 'https://api.siz.io' : 'http://api.dev.siz.io';

// Views
app.engine('html', cons.hogan);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

// Favicon
app.use(favicon(__dirname + '/static/dist/img/favicon.ico'));

// Static files
app.use('/static', express.static('static/dist'));

// Home page
app.get('/', function (req, res) {
  res.render('app');
});

// Story
app.get('/stories/:slug', function (req, res) {
  request(constants.API_ENDPOINT + '/stories?slug=' + req.params.slug, function (err, apiRes, body) {
    try {
      var story = body.stories;
      if (!story) throw new Error();
      story.shareUrl = req.protocol + '://' + req.headers.host + '/stories/' + story.slug;
      story.encodedShareUrl = encodeURIComponent(story.shareUrl);
      story.JSON = JSON.stringify(story).replace(/\//g, '\\/');
      res.render('story', story);
    } catch (err) {
      res.statusCode = apiRes.statusCode;
      res.render('error');
    }
  });
});

// Embedded Stories
app.get('/embed/:slug', function (req, res) {
  request(constants.API_ENDPOINT + '/stories?slug=' + req.params.slug, function (err, apiRes, body) {
    try {
      var story = body.stories;
      if (!story) throw new Error();
      story.shareUrl = req.protocol + '://' + req.headers.host + '/stories/' + story.slug;
      story.encodedShareUrl = encodeURIComponent(story.shareUrl);
      story.JSON = JSON.stringify(story).replace(/\//g, '\\/');
      res.render('embed', story);
    } catch (err) {
      res.statusCode = apiRes.statusCode;
      res.render('error');
    }
  });
});

// Stories
app.get('/stories/:slug', function (req, res) {
  request(constants.API_ENDPOINT + '/stories?slug=' + req.params.slug, function (err, apiRes, body) {
    try {
      var story = body.stories;
      if (!story) throw new Error();
      story.shareUrl = req.protocol + '://' + req.headers.host + req.url;
      story.encodedShareUrl = encodeURIComponent(story.shareUrl);
      story.JSON = JSON.stringify(story).replace(/\//g, '\\/');
      res.render('story', story);
    } catch (err) {
      res.statusCode = apiRes.statusCode;
      res.render('error');
    }
  });
});

// API token retrieval
function getToken(cb) {
  try {
    constants.API_TOKEN = fs.readFileSync(__dirname + '/tmp/token', {
      encoding: 'utf8'
    });
    cb();
  } catch (err) {
    request.post({
      url: constants.API_ENDPOINT + '/tokens',
      body: {}
    }, function (err, res, body) {
      if (err) return cb(err);
      if (res.statusCode >= 400) return cb(new Error('Token creation failed : HTTP error ' + res.statusCode));
      constants.API_TOKEN = body.tokens.id;
      mkdirp.sync(__dirname + '/tmp');
      fs.writeFileSync(__dirname + '/tmp/token', constants.API_TOKEN);
      cb();
    });
  }
}

// Server start
function startServer() {
  app.listen(1515, function (err) {
    if (err) return console.log(err.stack || err);
    console.log('Server start on port %s in %s mode', this.address().port, constants.MODE);
  });
}

getToken(function (err) {
  if (err) return console.log(err.stack || err);
  request = request.defaults({
    headers: {
      'X-Access-Token': constants.API_TOKEN
    }
  });
  startServer();
});
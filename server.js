var express = require('express');
var app = express();
var cons = require('consolidate');
var fs = require('fs-extra');
var favicon = require('serve-favicon');
var useragent = require('useragent');
var factory = require('./lib/factory');

// API
var api = {
  request: require('request').defaults({
    json: true,
    baseUrl: (app.get('env') === 'production') ? 'https://api.siz.io' : 'http://api.dev.siz.io'
  })
};
app.set('api', api);

// Views
app.engine('html', cons.hogan);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

// Favicon
app.use(favicon(__dirname + '/static/dist/dev/img/favicon.ico'));

// Static files
app.use('/static', express.static((app.get('env') === 'production') ? 'static/dist/prod' : 'static/dist/dev'));

// Home page
app.get('/', function (req, res) {
  res.render('home');
});

app.use('/factory', factory);

// App download
app.get('/get-the-app', function (req, res) {
  switch (useragent.lookup(req.headers['user-agent']).os.family) {
    case 'Android':
      {
        res.redirect('http://ad.apps.fm/kOplmSauaDOzVBBGCmJAWV5KLoEjTszcQMJsV6-2VnHFDLXitVHB6BlL95nuoNYfQdCcRgQKk3L5883T-Th4xUKQ2RDzjrQkls24bi1qDmnwmGoCp43dyUyi8sCzsPeK');
        break;
      }
    case 'iOS':
      {
        res.redirect('http://ad.apps.fm/90hjr4sAdA5hF70eoAC8zPE7og6fuV2oOMeOQdRqrE3ycgNsA4xKbwTdloUGRGypeQi4SQQMU9uRGhHF3n2TcxO790ZAUYOgdBYbSNhr0p8');
        break;
      }
    default:
      {
        res.redirect('/');
        break;
      }
  }
});

// Trending strips
app.get('/trending', function (req, res) {
  var page = Math.min(Math.max(Math.floor(Number(req.query.page)), 0), 10) || 1;
  api.request('/stories?limit=' + page * 5, function (err, apiRes, body) {
    res.render('trending', {
      stories: body.stories.slice((page - 1) * 5),
      currPage: page,
      nextPage: page === 10 ? 0 : page + 1,
      prevPage: page - 1,
    });
  });
});

// Strip
app.get('/stories/:slug', function (req, res) {
  api.request('/stories?slug=' + req.params.slug, function (err, apiRes, body) {
    try {
      var story = body.stories;
      if (!story) throw new Error();
      story.shareUrl = req.protocol + '://' + req.headers.host + '/stories/' + story.slug;
      story.encodedShareUrl = encodeURIComponent(story.shareUrl);
      story.JSON = JSON.stringify(story).replace(/\//g, '\\/');
      res.locals.isIOS = (useragent.lookup(req.headers['user-agent']).os.family === 'iOS');
      res.render('story', story);
    } catch (err) {
      res.statusCode = apiRes.statusCode;
      res.render('error');
    }
  });
});

// Embedded Strip
app.get('/embed/:slug', function (req, res) {
  api.request('/stories?slug=' + req.params.slug, function (err, apiRes, body) {
    try {
      var story = body.stories;
      if (!story) throw new Error();
      story.shareUrl = req.protocol + '://' + req.headers.host + '/stories/' + story.slug;
      story.embedUrl = req.protocol + '://' + req.headers.host + '/embed/' + story.slug;
      story.encodedShareUrl = encodeURIComponent(story.shareUrl);
      story.JSON = JSON.stringify(story).replace(/\//g, '\\/');
      res.render('embed', story);
    } catch (err) {
      res.statusCode = apiRes.statusCode;
      res.render('black', {
        message: 'Strip not found...'
      });
    }
  });
});

app.use(function (req, res) {
  res.status(404).render('error');
});

// API token retrieval
function getToken(cb) {
  var apiToken;
  try {
    if (app.get('env') === 'production')
      throw new Error('We should always request a new token on production launch');
    apiToken = fs.readFileSync(__dirname + '/tmp/token', {
      encoding: 'utf8'
    });
    cb(null, apiToken);
  } catch (err) {
    api.request.post({
      url: '/tokens',
      body: {}
    }, function (err, res, body) {
      if (err) return cb(err);
      if (res.statusCode >= 400) return cb(new Error('Token creation failed : HTTP error ' + res.statusCode));
      apiToken = body.tokens.id;
      if (app.get('env') === 'development')
        fs.outputFileSync(__dirname + '/tmp/token', apiToken);
      cb(null, apiToken);
    });
  }
}

// Server start
function startServer() {
  app.listen(1515, function (err) {
    if (err) return console.log(err.stack || err);
    console.log('Server start on port %s in %s mode', this.address().port, app.get('env'));
  });
}

getToken(function (err, apiToken) {
  if (err) return console.log(err.stack || err);
  api.request = api.request.defaults({
    headers: {
      'X-Access-Token': apiToken
    }
  });
  startServer();
});

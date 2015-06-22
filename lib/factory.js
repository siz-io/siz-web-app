var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var login = require('./login');

var factory = module.exports = express.Router();

var COOKIE_SIGNING_SECRET = 'F4ts0 The Keyb04rd C4t';
factory.use(cookieParser(COOKIE_SIGNING_SECRET));

function canAccessFactory(req) {
  try {
    return JSON.parse(req.signedCookies.token).permissions.accessFactory;
  } catch (e) {
    return false;
  }
}

// Login
factory.get('/login', function (req, res) {
  if (canAccessFactory(req)) return res.redirect('source');

  var error = {
    401: 'Wrong password...',
    404: 'Unknown email...'
  }[req.query.error];
  if (error) res.statusCode = Number(req.query.error);
  res.render('factory/login', {
    error: error
  });
});

factory.post('/classic-login', bodyParser.urlencoded({
  extended: false
}), function (req, res) {
  login.classic(req.body.email, req.body.password, function (err, token) {
    if (err) return res.redirect('login?error=404');
    res.cookie('token', JSON.stringify(token), {
      httpOnly: true,
      path: '/factory',
      signed: true
    });
    res.redirect('source');
  });
});

function testAccess(req, res, next) {
  if (canAccessFactory(req)) next();
  else res.redirect('/factory/login');
}

factory.get('/', testAccess, function (req, res) {
  res.redirect('/factory/source');
});

// Source
factory.get('/source', testAccess, function (req, res) {
  res.render('factory/source');
});

// Edit
factory.get('/edit', testAccess, function (req, res) {
  res.render('factory/edit');
});

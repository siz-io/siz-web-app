import express from 'express';
import cons from 'consolidate';
import favicon from 'serve-favicon';
import factory from './lib/factory';
import strips from './lib/strips';
import basicAuth from './lib/basic-auth';
import cookieParser from 'cookie-parser';
import createHTTPErr from 'http-errors';
/* beautify ignore:start */
import {hidePasswords, absPath, clientOs} from './lib/utils';
import {safeLoad as yamlSafeLoad} from 'js-yaml';
import {readFileSync} from 'fs';
/* beautify ignore:end */

const app = express();

app.engine('html', cons.hogan);
app.set('view engine', 'html');
app.set('views', absPath('views'));
app.set('trust proxy', true);
app.use(favicon(absPath('static/dist/dev/img/favicon.ico')));
if (process.env.BASIC_AUTH) basicAuth(app); // Basic Auth for dev endpoints
app.use('/static', express.static((app.get('env') === 'production') ? 'static/dist/prod' : 'static/dist/dev'));
app.use(cookieParser(process.env.COOKIE_SIGNING_SECRET || 'F4ts0 The Keyb04rd C4t'));
app.get('/', (req, res) => res.render('home'));
app.use('/factory', factory);
app.use(strips);

// App download
const trackingUrls = yamlSafeLoad(readFileSync(absPath('conf/app-dl-tracking-urls.yaml')));
app.set('tracking urls', trackingUrls);
app.get('/get-the-app', (req, res) =>
  res.redirect((trackingUrls[req.query.src] || trackingUrls.default)[clientOs(req)] || '/'));

// Unknown url
app.use(() => {
  throw createHTTPErr(404);
});

// Error handling
app.use(function (err, req, res, next) { // eslint-disable-line no-unused-vars
  console.log('ERROR on', req.method, req.url, hidePasswords(req.body) || '');
  console.log(err.statusCode ? err : (err.stack || err));
  console.log('');
  if (err.redirectUrl) res.redirect(err.redirectUrl);
  else if (/^\/ajax\//.test(req.url))
    res.status(err.statusCode || 500).send({
      errors: [err.clientMsg || err.apiResBody || {
        title: err.name || 'InternalServerError'
      }]
    });
  else res.status(err.statusCode || 500).render(err.view || 'error', {
    errMsg: err.clientMsg || (err.statusCode < 500 ? 'There\'s nothing here...' : 'Oops... Something went wrong on our side.')
  });
});

app.listen(1515, function (err) {
  if (err) return console.log(err.stack || err);
  console.log('Server start on port %s in %s mode', this.address().port, app.get('env'));
  console.log('');
});

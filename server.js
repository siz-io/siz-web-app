import express from 'express';
import cons from 'consolidate';
import favicon from 'serve-favicon';
import useragent from 'useragent';
import factory from './lib/factory';
import strips from './lib/strips';
import basicAuth from './lib/basic-auth';
import cookieParser from 'cookie-parser';
import path from 'path';
import createHTTPErr from 'http-errors';
/* beautify ignore:start */
import {hidePasswords} from './lib/utils';
/* beautify ignore:end */

const app = express();

app.engine('html', cons.hogan);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
app.set('trust proxy', true);
app.use(favicon(path.join(__dirname, '/static/dist/dev/img/favicon.ico')));
if (process.env.BASIC_AUTH) basicAuth(app); // Basic Auth for dev endpoints
app.use('/static', express.static((app.get('env') === 'production') ? 'static/dist/prod' : 'static/dist/dev'));
app.use(cookieParser(process.env.COOKIE_SIGNING_SECRET || 'F4ts0 The Keyb04rd C4t'));
app.get('/', (req, res) => res.render('home'));
app.use('/factory', factory);
app.use(strips);

// App download
app.get('/get-the-app', (req, res) => {
  const fromFb = (req.query.src === 'fb');
  switch (useragent.lookup(req.headers['user-agent']).os.family) {
    case 'Android':
      {
        res.redirect(
          fromFb ?
          'http://ad.apps.fm/tIHnlV9MJ7n7I396kv1kELL7POj-y_ZJZxxUgeNYK8M2lLagVwZ2vz-PCHjw5bq80bjulM_0aO9WzZjf61UPXQ' :
          'http://ad.apps.fm/kOplmSauaDOzVBBGCmJAWV5KLoEjTszcQMJsV6-2VnHFDLXitVHB6BlL95nuoNYfQdCcRgQKk3L5883T-Th4xUKQ2RDzjrQkls24bi1qDmnwmGoCp43dyUyi8sCzsPeK'
        );
        break;
      }
    case 'iOS':
      {
        res.redirect(
          fromFb ?
          'http://ad.apps.fm/DSGVJuBGHDUZG3VntFfnzPE7og6fuV2oOMeOQdRqrE3ycgNsA4xKbwTdloUGRGypLnfa-r5MdHdW9jqZpKNWhBRoTqVPU3WAv9GqJZFwDgc' :
          'http://ad.apps.fm/90hjr4sAdA5hF70eoAC8zPE7og6fuV2oOMeOQdRqrE3ycgNsA4xKbwTdloUGRGypeQi4SQQMU9uRGhHF3n2TcxO790ZAUYOgdBYbSNhr0p8'
        );
        break;
      }
    default:
      {
        res.redirect('/');
        break;
      }
  }
});

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
  else res.status(err.statusCode || 500).render(err.view || 'error', {
    errMsg: err.clientMsg || (err.statusCode < 500 ? 'There\'s nothing here...' : 'Oops... Something went wrong on our side.')
  });
});

app.listen(1515, function (err) {
  if (err) return console.log(err.stack || err);
  console.log('Server start on port %s in %s mode', this.address().port, app.get('env'));
  console.log('');
});

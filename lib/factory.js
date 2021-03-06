/* beautify ignore:start */
import {Router} from 'express';
import {urlencoded} from 'body-parser';
import {json} from 'body-parser';
import apiMiddleware from './api';
import {classicLogin} from './login';
/* beautify ignore:end */

const factory = Router(); // eslint-disable-line new-cap
export default factory;

const canAccessFactory = () => {
  return true;
  // try {
  //   return req.signedCookies.token.permissions.accessFactory;
  // } catch (e) {
  //   return false;
  // }
};

factory.get('/login', (req, res) => {
  if (canAccessFactory(req)) return res.redirect('source');

  const error = {
    400: 'Wrong email...',
    401: 'Wrong password...',
    404: 'Wrong email...'
  }[req.query.error];
  if (error) res.statusCode = Number(req.query.error);
  res.render('factory/login', {
    error: error
  });
});

factory.use(apiMiddleware);

factory.post('/classic-login', urlencoded({
  extended: false
}), (req, res, next) => {
  classicLogin(req, res)
    .then(() => res.redirect('source'))
    .catch(err => {
      if (err.statusCode < 500) err.redirectUrl = `login?error=${err.statusCode}`;
      next(err);
    });
});

factory.use((req, res, next) => canAccessFactory(req) ? next() : res.redirect('/factory/login'));
factory.get('/', (req, res) => res.redirect('/factory/source'));
factory.get('/source', (req, res) => res.render('factory/source'));
factory.get('/edit', (req, res) => req.query.video ? res.render('factory/edit') : res.redirect('source'));
factory.post('/create-strip', json(), (req, res) => req.apiCall({
    method: 'POST',
    url: '/stories',
    body: req.body
  })
  .then(body => res.send(body))
  .catch(err => res.status(err.statusCode).send(err.message)));

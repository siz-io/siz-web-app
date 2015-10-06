import request from 'request';
import createHTTPErr from 'http-errors';
/* beautify ignore:start */
import {hidePasswords} from './utils';
/* beautify ignore:end */

const apiEngine = request.defaults({
  json: true,
  baseUrl: process.env.API_ENDPOINT || ((process.env.NODE_ENV === 'production') ? 'https://api.siz.io' : 'http://api.dev.siz.io')
});

const apiCall = ({
  method = 'GET', url, token = '', body, fromIP = ''
}) => (new Promise((resolve, reject) => {
  apiEngine({
    method, url, body,
    headers: {
      'X-Access-Token': token.id || '',
      'X-Forwarded-For': fromIP
    }
  }, (err, res, apiResBody) => {
    if (err) reject(createHTTPErr(502, err));
    else if (res.statusCode >= 400)
      reject(createHTTPErr((res.statusCode < 500) ? res.statusCode : 502, 'API Error', {
        method, url, body: hidePasswords(body), apiResBody
      }));
    else resolve(apiResBody);
  });
}));

const ensureToken = (req, res) => new Promise(resolve => {
  resolve(req.token ? req.token : apiCall({
    method: 'POST',
    url: '/tokens',
    body: {}
  }).then(body => {
    const token = body.tokens;
    req.token = token;
    res.saveToken(token);
  }));
});

const consolidateCall = (call, req) => {
  if (typeof call === 'function') call = call();
  if (typeof call === 'string') call = {
    url: call
  };
  call.token = req.token;
  call.fromIP = req.ip;
  return call;
};

// Middleware to expose req.apiCall({method, url, body} || url) => Promise(body)
export default (req, res, next) => {
  req.token = req.signedCookies.token;
  res.saveToken = token => res.cookie('token', token, {
    signed: true,
    httpOnly: true
  });
  // You can pass a call or a function returning one
  // When this function is called you're sure to have a valid req.token
  req.apiCall = call => ensureToken(req, res)
    .then(() => apiCall(consolidateCall(call, req)));
  next();
};

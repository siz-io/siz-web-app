import request from 'request';
import createHTTPErr from 'http-errors';

const apiEngine = request.defaults({
  json: true,
  baseUrl: process.env.API_ENDPOINT || ((process.env.NODE_ENV === 'production') ? 'https://api.siz.io' : 'http://api.dev.siz.io')
});

const hidePasswords = (body) => {
  if (typeof body === 'object')
    Object.keys(body).forEach(key => body[key] = (key === 'password') ? '**NOT_LOGGED**' : hidePasswords(body[key]));
  return body;
};

const apiCall = ({
  method = 'GET', url, token, body
}) => (new Promise((resolve, reject) => {
  if (typeof arguments[0] === 'string') url = arguments[0];
  apiEngine({
    method, url, body,
    headers: {
      'X-Access-Token': (token && token.id) || ''
    }
  }, (err, res, apiResBody) => {
    if (err) reject(createHTTPErr(502, 'API is unreachable'));
    else if (res.statusCode >= 400)
      reject(createHTTPErr((res.statusCode < 500) ? res.statusCode : 502, 'API Error : ' + JSON.stringify(apiResBody), {
        method, url, body: hidePasswords(body)
      }));
    else resolve(apiResBody);
  });
})).catch(err => {
  console.log(err);
  throw err;
});

const ensureToken = (req, res) => new Promise(resolve => {
  resolve(req.token ? req.token : apiCall({
    method: 'POST',
    url: '/tokens',
    body: {}
  }).then(body => {
    const token = body.tokens;
    req.token = token;
    res.saveToken(token);
    return token;
  }));
});

const addTokenHeader = (call, token) => {
  call.token = token;
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
    .then(token => apiCall(addTokenHeader((typeof call === 'function') ? call() : call, token)));
  next();
};

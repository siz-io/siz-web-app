import basicAuth from 'basic-auth';

export default app => {
  const credentials = process.env.BASIC_AUTH.split(':');
  const login = credentials[0];
  const pass = credentials[1];
  if (login && pass)
    app.use((req, res, next) => {
      const authTry = basicAuth(req);
      if (!authTry || authTry.name !== login || authTry.pass !== pass) {
        res.setHeader('WWW-Authenticate', 'Basic realm="Restricted access"');
        res.status(401).send('<h1 style="text-align:center">Access denied<br><br><img src="http://i.imgur.com/lWS77Gt.gif"></h1>');
      } else next();
    });
};

/* beautify ignore:start */
import {createHash} from 'crypto';
/* beautify ignore:end */
const hash = pass => createHash('sha256').update(pass + 'UckZiS7Hl7xPMhkX5cCqKFh6rZaSgUsylbppDRULL9Y=').digest('hex');

export const classicLogin = (req, res) => req.apiCall(() => ({
  method: 'PUT',
  url: '/tokens/' + req.token.id,
  body: {
    users: {
      email: req.body.email,
      password: hash(req.body.password)
    }
  }
})).then(body => res.saveToken(body.tokens));

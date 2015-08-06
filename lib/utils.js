import useragent from 'useragent';
/* beautify ignore:start */
import {join as joinPath} from 'path';
/* beautify ignore:end */

export const hidePasswords = body => {
  if (typeof body === 'object')
    Object.keys(body).forEach(key => body[key] = (key === 'password') ? '**HIDDEN**' : hidePasswords(body[key]));
  return body;
};

export const absPath = relPath => joinPath(__dirname, '..', relPath);

export const clientOs = req => useragent.lookup(req.headers['user-agent']).os.family.toLowerCase();

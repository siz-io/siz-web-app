export const hidePasswords = body => {
  if (typeof body === 'object')
    Object.keys(body).forEach(key => body[key] = (key === 'password') ? '**HIDDEN**' : hidePasswords(body[key]));
  return body;
};

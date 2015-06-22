module.exports = {
  classic: function (user, password, cb) {
    if (password === 'coucou') cb(null, {
      id: 'tokenId',
      permissions: {
        accessFactory: true
      }
    });
    else cb(new Error('Wrong pass'));
  }
};

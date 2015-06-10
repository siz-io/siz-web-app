var keyMirror = require('react/lib/keyMirror');

module.exports = keyMirror({
  CREATE_STRIP: null,
  SET_PLAYBACK_FOR_GIF_IN_STRIP: null, // {index: 0-3, command: 'PLAY|STOP'}
  SET_ACTIVE_GIF: null // {index: 0-3}
});

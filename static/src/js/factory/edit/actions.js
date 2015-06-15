var keyMirror = require('react/lib/keyMirror');

// keys are actions' `type`s and values document the other actions' keys
module.exports = keyMirror({
  CREATE_STRIP: null,
  SET_PLAYBACK_FOR_GIF_IN_STRIP: {
    index: '0-3',
    command: 'PLAY|STOP'
  },
  SET_ACTIVE_GIF: {
    index: '0-3',
    snapFromPreview: { // don't pass anything to keep existing cut
      currentMs: 'milliseconds',
      totalMs: 'milliseconds'
    }
  },
  SEEK_PREVIEW: {
    value: '[0-(MAX_FRAMES-1), 0-(MAX_FRAMES-1)]',
    handler: 'LEFT|RIGHT'
  },
  RECORD_GIF: {
    value: '[0-(MAX_FRAMES-1), 0-(MAX_FRAMES-1)]'
  }
});

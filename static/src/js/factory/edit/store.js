var dispatcher = require('./dispatcher');
var EventEmitter = require('events').EventEmitter;
var actions = require('./actions');
var c = require('./constants');
var I = require('immutable');

var store = module.exports = new EventEmitter();

// Initial state
store.state = I.fromJS({
  gifs: [{
    active: false,
    playing: false,
    startMs: 0,
    endMs: 0
  }, {
    active: false,
    playing: false,
    startMs: 0,
    endMs: 0
  }, {
    active: false,
    playing: false,
    startMs: 0,
    endMs: 0
  }, {
    active: false,
    playing: false,
    startMs: 0,
    endMs: 0
  }],
  timeline: {
    startFrame: 0,
    value: c.TIMELINE_DEFAULT_VALUE
  },
  seeking: false,
  totalFrames: 0
});

function toMs(timelineFrames, startFrame) {
  var s = store.state;
  return c.FRAME_DELAY * Math.max(Math.min(
    timelineFrames + (startFrame || s.getIn(['timeline', 'startFrame'])),
    s.get('totalFrames')), 0);
}

function toFrames(milliseconds) {
  return Math.floor(milliseconds / c.FRAME_DELAY);
}

function timelineStartFrameFromPreview(currentMs) {
  var currentFrame = toFrames(currentMs);
  var totalFrames = store.state.get('totalFrames');
  if (totalFrames < c.MAX_FRAMES) return Math.floor(totalFrames - c.MAX_FRAMES / 2);
  var result = Math.max(currentFrame - Math.floor(c.MAX_FRAMES / 2), 0);
  return (result + c.MAX_FRAMES > totalFrames) ? (totalFrames - c.MAX_FRAMES) : result;
}

function timelineStartFrameFromGif(gif) {
  return timelineStartFrameFromPreview((gif.get('startMs') + gif.get('endMs')) / 2);
}

module.exports.dispatchToken = dispatcher.register(function (action) {
  switch (action.type) {
    case actions.CREATE_STRIP:
      break;

    case actions.SET_ACTIVE_GIF:
      {
        if (action.snapFromPreview)
          store.state = store.state.set('totalFrames', toFrames(action.snapFromPreview.totalMs));

        var newStartFrame = action.snapFromPreview ?
          timelineStartFrameFromPreview(action.snapFromPreview.currentMs) :
          timelineStartFrameFromGif(store.state.getIn(['gifs', action.index]));
        store.state = store.state
          .update('timeline', function (timeline) {
            return timeline
              .set('startFrame', newStartFrame)
              .set('value', I.fromJS(action.snapFromPreview ?
                c.TIMELINE_DEFAULT_VALUE : [
                  toFrames(store.state.getIn(['gifs', action.index, 'startMs'])) - newStartFrame,
                  toFrames(store.state.getIn(['gifs', action.index, 'endMs'])) - newStartFrame
                ]));
          })
          .update('gifs', function (gifs) {
            return gifs.map(function (gif) {
              return gif.set('active', false);
            });
          })
          .updateIn(['gifs', action.index], function (gif) {
            var activeGif = gif.set('active', true);
            if (action.snapFromPreview)
              activeGif = activeGif
              .set('startMs', toMs(c.TIMELINE_DEFAULT_VALUE[0], newStartFrame))
              .set('endMs', toMs(c.TIMELINE_DEFAULT_VALUE[1], newStartFrame));
            return activeGif;
          });
        store.emit('change');
        break;
      }

    case actions.SET_PLAYBACK_FOR_GIF_IN_STRIP:
      {
        store.state = store.state.setIn(['gifs', action.index, 'playing'], action.command === 'PLAY');
        store.emit('change');
        break;
      }

    case actions.SEEK_PREVIEW:
      {
        var seekToValue = action.value[action.handler === 'LEFT' ? 0 : 1];
        store.state = store.state
          .set('seeking', true)
          .setIn(['timeline', 'value'], I.fromJS(action.value))
          .update('gifs', function (gifs) {
            return gifs.map(function (gif) {
              return gif.get('active') ?
                gif.set('startMs', toMs(seekToValue)) :
                gif;
            });
          });
        store.emit('change');
        break;
      }

    case actions.RECORD_GIF:
      {
        var value = action.value;
        store.state = store.state
          .set('seeking', false)
          .setIn(['timeline', 'value'], I.fromJS(value))
          .update('gifs', function (gifs) {
            return gifs.map(function (gif) {
              return gif.get('active') ?
                gif.set('startMs', toMs(value[0])).set('endMs', toMs(value[1])) :
                gif;
            });
          });
        store.emit('change');
        break;
      }
  }
});

var dispatcher = require('./dispatcher');
var EventEmitter = require('events').EventEmitter;
var actions = require('./actions');
var I = require('immutable');

var store = module.exports = new EventEmitter();

// Initial state
store.state = I.fromJS({
  gifs: [{
    active: false,
    playing: false
  }, {
    active: false,
    playing: false
  }, {
    active: false,
    playing: false
  }, {
    active: false,
    playing: false
  }]
});

module.exports.dispatchToken = dispatcher.register(function (action) {
  switch (action.type) {
    case actions.CREATE_STRIP:
      break;

    case actions.SET_ACTIVE_GIF:
      store.state = store.state
        .update('gifs', function (gifs) {
          return gifs.map(function (gif) {
            return gif.set('active', false);
          });
        })
        .setIn(['gifs', action.index, 'active'], true);
      store.emit('change');
      break;

    case actions.SET_PLAYBACK_FOR_GIF_IN_STRIP:
      store.state = store.state.setIn(['gifs', action.index, 'playing'], action.command === 'PLAY');
      store.emit('change');
      break;
  }
});

var dispatcher = require('./dispatcher');
var EventEmitter = require('events').EventEmitter;
var actions = require('./actions');
var I = require('immutable');

var store = module.exports = new EventEmitter();

// Initial state
store.state = I.fromJS({
  activeGifIdx: -1,
  gifs: [{}, {}, {}, {}]
});

module.exports.dispatchToken = dispatcher.register(function (action) {
  switch (action.type) {
    case actions.DO_NOTHING:
      break;

    case actions.CREATE_STRIP:
      break;

    case actions.SET_ACTIVE_GIF:
      store.state = store.state.set('activeGifIdx', action.index);
      store.emit('change');
      break;
  }
});

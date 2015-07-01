var EventEmitter = require('events').EventEmitter;

var clockStore = module.exports = new EventEmitter();
var _timerId = null;

clockStore.on('newListener', function () {
  if (!_timerId) setInterval(function () {
    if (!clockStore.emit('change')) clearInterval(_timerId);
  });
});

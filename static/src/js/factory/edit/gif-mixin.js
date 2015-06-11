var React = require('react');
var clockStore = require('./clock-store');

var FRAME_RATE = 8;
var FRAME_DELAY = 1000 / FRAME_RATE;


// Common behaviour for Gif components
// All durations are in milliseconds

module.exports = {
  displayName: 'Gif',

  propTypes: {
    video: React.PropTypes.string.isRequired,
    startMs: React.PropTypes.number.isRequired,
    endMs: React.PropTypes.number.isRequired,
    playing: React.PropTypes.bool.isRequired
  },

  addClockListener: function () {
    if (clockStore.listeners('change').indexOf(this.sync) === -1)
      clockStore.addListener('change', this.sync);
  },

  componentWillReceiveProps: function (nextProps) {
    if (nextProps.playing !== this.props.playing) {
      if (nextProps.playing) this.addClockListener();
      else clockStore.removeListener('change', this.sync);
      this.seekToMs(nextProps.startMs);
    }
  },

  seekToMs: function (milliseconds) {
    this.setCurrentMs(milliseconds);
    this._lastSyncMs = Date.now();
  },

  sync: function () {
    var p = this.props;
    if (!p.playing) return this.seekToMs(p.startMs);
    var nowMs = Date.now();
    if (nowMs - this._lastSyncMs >= FRAME_DELAY) {
      var newCurrentMs = this.getCurrentMs() + FRAME_DELAY;
      this.seekToMs((newCurrentMs <= p.endMs) ? newCurrentMs : p.startMs);
    }
  },

  componentDidMount: function () {
    if (typeof (this.setupPlayer) === 'function') this.setupPlayer();
    if (this.props.playing) this.addClockListener();
    this.seekToMs(this.props.startMs);
  }
};

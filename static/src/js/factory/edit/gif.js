var React = require('react');
var PureRenderMixin = React.addons.PureRenderMixin;
var clockStore = require('./clock-store');

var FRAME_RATE = 8;
var FRAME_DELAY = 1000 / FRAME_RATE;

// All durations are in milliseconds (except HTML <video> tag's currentTime)

module.exports = React.createClass({
  displayName: 'Gif',
  mixins: [PureRenderMixin],

  propTypes: {
    videoUrl: React.PropTypes.string.isRequired,
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

  getCurrentMs: function () {
    return this.refs.video.getDOMNode().currentTime * 1000;
  },

  seekToMs: function (milliseconds) {
    this.refs.video.getDOMNode().currentTime = milliseconds / 1000.0;
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
    if (this.props.playing) this.addClockListener();
    this.seekToMs(this.props.startMs);
  },

  render: require('./gif.jsx')
});

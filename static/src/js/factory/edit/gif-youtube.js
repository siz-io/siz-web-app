var React = require('react');
var gifMixin = require('./gif-mixin');
var Player = require('youtube-wrapper').Player;

module.exports = React.createClass({
  displayName: 'Gif',
  mixins: [gifMixin],

  getCurrentMs: function () {
    return (this.player.getCurrentTime() * 1000) || this.props.startMs;
  },

  setCurrentMs: function (milliseconds) {
    this.player.seekTo(Math.min(milliseconds / 1000, this.player.getDuration() || Infinity), true);
  },

  setupPlayer: function () {
    var player = this.player = new Player(this.getDOMNode(), {
      videoId: this.props.video,
      playerVars: {
        'rel': 0,
        'autoplay': 1,
        'autohide': 1,
        'controls': 0,
        'disablekb': 1,
        'playsinline': 1,
        'modestbranding': 1,
        'fs': 0,
        'showinfo': 0,
        'iv_load_policy': 3
      }
    });
    player.on('onStateChange', function (e) {
      if (e.data === 1) player.pauseVideo();
    });
    player.setPlaybackQuality('small');
    player.mute();
  },

  render: function () {
    return React.createElement('div');
  }
});

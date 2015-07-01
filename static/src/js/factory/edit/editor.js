var React = require('react');
var PureRenderMixin = React.addons.PureRenderMixin;
var store = require('./store');
var dispatcher = require('./dispatcher');
var actions = require('./actions');
var Player = require('youtube-wrapper').Player;

module.exports = React.createClass({
  displayName: 'Editor',
  mixins: [PureRenderMixin],

  propTypes: {
    video: React.PropTypes.string.isRequired,
    onEditionComplete: React.PropTypes.func.isRequired
  },

  getInitialState: function () {
    return {
      data: store.state
    };
  },

  getGifSelectorClass: function (gif) {
    return gif.get('active') ? 'active' : (gif.get('endMs') > 0 ? 'valid' : '');
  },

  getActiveGif: function (gifs) {
    return gifs.find(function (gif) {
      return gif.get('active');
    });
  },

  canSubmitStrip: function (gifs) {
    return !!gifs.find(function (gif) {
      return gif.get('endMs') > 0;
    });
  },

  getGifIndicator: function (gifs) {
    return [1, 2, 3, 4][gifs.findIndex(function (gif) {
      return gif.get('active');
    })];
  },

  isPreviewPlaying: function (gifs) {
    return !gifs.reduce(function (previewLocked, gif) {
      return previewLocked || gif.get('playing');
    }, false);
  },

  componentDidMount: function () {
    this.previewPlayer = window.player = new Player(this.refs.preview.getDOMNode(), {
      videoId: this.props.video,
      playerVars: {
        'rel': 0,
        'autoplay': 1,
        'autohide': 1,
        'controls': 1,
        'playsinline': 1,
        'modestbranding': 1,
        'fs': 0,
        'showinfo': 0,
        'iv_load_policy': 3
      }
    });
    this.previewPlayer.setPlaybackQuality('small');
    store.on('change', function () {
      this.setState({
        data: store.state
      });
    }.bind(this));
  },

  onClickSelector: function (selectorIdx, e) {
    e.preventDefault();
    this.previewPlayer.pauseVideo();
    dispatcher.dispatch({
      type: actions.SET_ACTIVE_GIF,
      index: selectorIdx,
      snapFromPreview: {
        currentMs: (this.previewPlayer.getCurrentTime() * 1000) || 0,
        totalMs: (this.previewPlayer.getDuration() * 1000) || 0
      }
    });
  },

  onClickCreateStrip: function (e) {
    e.preventDefault();
    this.refs.substripArea.getDOMNode().className += ' edit-title';
    setTimeout(function () {
      this.refs.titleField.getDOMNode().focus();
    }.bind(this), 200);
  },

  onTimelineChange: function (value) {
    dispatcher.dispatch({
      type: actions.SEEK_PREVIEW,
      handler: /handle-0/.test(this.getDOMNode().querySelector('.slider .active').className) ? 'LEFT' : 'RIGHT',
      value: value
    });
  },

  onTimelineRelease: function (value) {
    dispatcher.dispatch({
      type: actions.RECORD_GIF,
      value: value
    });
  },

  onMouseEnterGif: function (gifIdx) {
    dispatcher.dispatch({
      type: actions.SET_PLAYBACK_FOR_GIF_IN_STRIP,
      index: gifIdx,
      command: 'PLAY'
    });
  },

  onMouseLeaveGif: function (gifIdx) {
    dispatcher.dispatch({
      type: actions.SET_PLAYBACK_FOR_GIF_IN_STRIP,
      index: gifIdx,
      command: 'STOP'
    });
  },

  onClickGif: function (gifIdx, e) {
    e.preventDefault();
    this.previewPlayer.pauseVideo();
    dispatcher.dispatch({
      type: actions.SET_ACTIVE_GIF,
      index: gifIdx
    });
  },

  onTitleSubmit: function (e) {
    e.preventDefault();
    if (document.activeElement) document.activeElement.blur();
    this.previewPlayer.pauseVideo();
    var title = this.refs.titleField.getDOMNode().value;
    if (title.length > 100) return window.alert('Title is too long : 100 characters max.'); // eslint-disable-line no-alert
    this.props.onEditionComplete({
      title: title,
      boxes: store.state.get('gifs').filter(function (gif) {
        return gif.get('endMs') > 0;
      }).map(function (gif) {
        return gif.mapKeys(function (key) {
          return {
            startMs: 'start',
            endMs: 'stop'
          }[key] || 'dropThisKey';
        }).delete('dropThisKey');
      }).toJS(),
      source: {
        type: 'youtube',
        id: this.props.video
      }
    });
  },

  render: require('./editor.jsx')
});

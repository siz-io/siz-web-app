var React = require('react');
var PureRenderMixin = React.addons.PureRenderMixin;
var store = require('./store');
var dispatcher = require('./dispatcher');
var actions = require('./actions');

module.exports = React.createClass({
  displayName: 'Editor',
  mixins: [PureRenderMixin],

  getInitialState: function () {
    return {
      data: store.state
    };
  },

  getGifSelectorClass: function (gif) {
    if (gif.get('active')) return 'active';
    else return '';
  },

  getGifIndicator: function (gifs) {
    return [1, 2, 3, 4][gifs.findIndex(function (gif) {
      return gif.get('active');
    })];
  },

  getLockPreview: function (gifs) {
    return gifs.reduce(function (lockPreview, gif) {
      return lockPreview || gif.get('playing');
    }, false);
  },

  componentDidMount: function () {
    store.on('change', function () {
      this.setState({
        data: store.state
      });
    }.bind(this));
  },

  onClickSelector: function (selectorIdx, e) {
    e.preventDefault();
    dispatcher.dispatch({
      type: actions.SET_ACTIVE_GIF,
      index: selectorIdx
    });
  },

  onClickCreateStrip: function (e) {
    e.preventDefault();
    dispatcher.dispatch({
      type: actions.CREATE_STRIP
    });
  },

  onTimelineChange: function (value) {
    console.log('onTimelineChange: ', value);
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

  render: require('./editor.jsx')
});

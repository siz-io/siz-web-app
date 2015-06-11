var React = require('react');
var gifMixin = require('./gif-mixin');

module.exports = React.createClass({
  displayName: 'Gif',
  mixins: [gifMixin],

  getCurrentMs: function () {
    return this.refs.video.getDOMNode().currentTime * 1000;
  },

  setCurrentMs: function (milliseconds) {
    this.refs.video.getDOMNode().currentTime = milliseconds / 1000.0;
  },

  render: require('./gif-video.jsx')
});

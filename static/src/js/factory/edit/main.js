require('youtube-wrapper').autoLoadYouTubeAPI();
var React = require('react/addons');
var Editor = require('./editor');
var url = require('url');

React.render(React.createElement(Editor, {
  video: url.parse(window.location.href, true).query.video
}), document.getElementById('react-editor-mount-point'));

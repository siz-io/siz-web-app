require('youtube-wrapper').autoLoadYouTubeAPI();
var React = require('react/addons');
var Editor = require('./editor');

React.render(React.createElement(Editor), document.getElementById('react-editor-mount-point'));

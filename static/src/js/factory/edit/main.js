require('youtube-wrapper').autoLoadYouTubeAPI();
var React = require('react/addons');
var Editor = require('./editor');
var url = require('url');
var createStrip = require('./create-strip');

var editorMountPoint = document.getElementById('react-editor-mount-point');

React.render(React.createElement(Editor, {
  video: url.parse(window.location.href, true).query.video,
  onEditionComplete: function (stripData) {
    editorMountPoint.className = 'inactive';
    createStrip(stripData);
  }
}), editorMountPoint);

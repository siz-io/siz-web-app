var stripCreatorElement = document.getElementById('strip-creator');
var editorBg = document.querySelector('.editor-bg');
var stripPlaceholder = document.querySelector('.strip-placeholder');
var stripShare = document.querySelector('.strip-share');

function displayStrip(strip) {
  editorBg.className = editorBg.className.replace(/collapsed/, '');
  stripPlaceholder.innerHTML = '<iframe width="100%" height="100%" src="/embed/wooden-non-circular-planetary-gears" scrolling="no" frameborder="0" allowfullscreen></iframe>';
  stripShare.className += ' active';
  var link = 'http://' + window.location.host + '/stories/wooden-non-circular-planetary-gears';
  var linkTag = stripShare.querySelector('.link');
  linkTag.innerHTML = link;
  linkTag.href = link;
}

module.exports = function (stripData) {
  stripCreatorElement.className = 'active';
  editorBg.className += ' collapsed';
  stripPlaceholder.className += ' active';

  setTimeout(function () {
    displayStrip();
  }, 5000);
};

var isEmbed = true; // i.e. not used in /stories page
try {
  isEmbed = window.top.location.host !== window.location.host || window.top === window;
} catch (ignored) {}
if (isEmbed) {
  document.querySelector('.powered-by').style.display = 'block';
  window.ga('send', 'pageview');
}

var story = window._storyData;
story.aspectRatio = story.boxes[0].width / story.boxes[0].height;
story.nBoxes = Math.min(story.boxes.length, 4); // Fix old stories

require('./adapt-grid')(story);
require('./set-gif-urls')(story);
require('./play-handler.js')(story);
require('./share.js');

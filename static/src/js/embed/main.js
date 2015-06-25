var isEmbed = true; // i.e. not used in /stories page
try {
  isEmbed = window.top.location.host !== window.location.host || window.top === window;
} catch (ignored) {
  // Do nothing
}
if (isEmbed) {
  document.querySelector('.powered-by').style.display = 'block';

  // Set self analytics
  /* eslint-disable */
  (function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function () {
      (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date();
    a = s.createElement(o),
      m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m);
  })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
  /* eslint-enable */
  window.ga('create', 'UA-57580957-1', 'auto');
  window.ga('send', 'pageview');

} else window.ga = window.top.ga; // use analytics from top frame

var story = window._storyData;
story.aspectRatio = story.boxes[0].width / story.boxes[0].height;
story.nBoxes = Math.min(story.boxes.length, 4); // Fix old stories

require('./adapt-grid')(story);
require('./set-gif-urls')(story);
require('./play-handler.js')(story);
require('./share.js');

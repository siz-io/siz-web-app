var $ = document.querySelector.bind(document);

var player;
var playerReady = false;

function playVideo() {
  if ($('#player-container').className === '' && playerReady) player.playVideo();
}

function showPlayer(videoId) {
  $('#player-container').className = '';

  if (!player) player = new window.YT.Player('player-placeholder', {
    height: '100%',
    width: '100%',
    videoId: videoId,
    playerVars: {
      autoplay: 1,
      'iv_load_policy': 3
    },
    events: {
      onReady: function () {
        playerReady = true;
      }
    }
  });

  playVideo();
}

module.exports = function (story) {
  $('.play-btn').onclick = function (event) {
    window.ga('send', 'event', 'story', 'play', story.slug);
    event.preventDefault();
    showPlayer(story.source.id);
  };
  $('.play-full a').onclick = function (event) {
    window.ga('send', 'event', 'story', 'play', story.slug);
    event.preventDefault();
    showPlayer(story.source.id);
  };

  $('.close-btn').onclick = function (event) {
    event.preventDefault();
    if (playerReady) player.pauseVideo();
    $('#player-container').className = 'hidden';
  };
};

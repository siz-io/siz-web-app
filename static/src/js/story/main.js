require('../lib/app-link');

// iOS popover
if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/iPad/i))) {
  document.getElementById('overlay').style.display = 'inline';
  document.getElementById('backtoapp').onclick = function () {
    document.getElementById('overlay').style.display = 'none';
    window.location.href = '#story_video';
  };
}

// Android alert
var ANDROID_CTA = 'We are searching for Beta Testers for our amazing Android app. Would you like to be part of it?';
if (navigator.userAgent.match(/Android/i) && window.confirm(ANDROID_CTA)) {
  window.location.href = 'http://siz-app.launchrock.com/';
}

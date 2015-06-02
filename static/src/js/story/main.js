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
var ANDROID_CTA = 'We have an awesome app designed for mobile. It looks a trillion times better!!! Do you want to download it?';
if (navigator.userAgent.match(/Android/i) && window.confirm(ANDROID_CTA)) {
  window.location.href = 'http://ad.apps.fm/oDwkHjcrWLrNoLmnN1Lwel5KLoEjTszcQMJsV6-2VnHFDLXitVHB6BlL95nuoNYfQdCcRgQKk3L5883T-Th4xWvE6TgaBCrtTMbUCm43ptTQQFtvGmGm78YegHkNWCxf';
}

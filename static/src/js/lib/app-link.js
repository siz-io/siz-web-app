var IOS_LINK = 'http://ad.apps.fm/CL9wdn36rL36IlNMC7hjjvE7og6fuV2oOMeOQdRqrE3ycgNsA4xKbwTdloUGRGyplLn3FQ9Yn0PUtVvuWYZSMn-2sILGiWD4EUofgGxvuTfwmGoCp43dyUyi8sCzsPeK';
var ANDROID_LINK = 'http://play.google.com';

var $all = function (selector) {
  return Array.prototype.slice.call(document.querySelectorAll(selector));
};
var appBtns = $all('.app-download');

if (/android/i.test(navigator.userAgent)) {
  appBtns.forEach(function (btn) {
    btn.href = ANDROID_LINK;
    btn.className += ' android';
  });
} else {
  appBtns.forEach(function (btn) {
    btn.href = IOS_LINK;
    btn.className += ' ios';
  });
}

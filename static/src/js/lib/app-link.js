var $all = function (selector) {
  return Array.prototype.slice.call(document.querySelectorAll(selector));
};
var appBtns = $all('.app-download');

if (/android/i.test(navigator.userAgent))
  appBtns.forEach(function (btn) {
    btn.href = "/get-the-app?origin=story&amp;os=android";
    btn.className += ' android';
  });
else
  appBtns.forEach(function (btn) {
    btn.href = '/get-the-app?origin=story&amp;os=ios';
    btn.className += ' ios';
  });

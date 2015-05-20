var $ = document.querySelector.bind(document);
var $all = function (selector) {
  return Array.prototype.slice.call(document.querySelectorAll(selector));
};
var shareboxContainer = $('#sharebox-container');

$all('.share-btn').forEach(function (btn) {
  btn.onclick = function (event) {
    event.preventDefault();
    shareboxContainer.className = 'open';
  };
});

$('#sharebox').onclick = function (event) {
  event.stopPropagation();
};

$('#sharebox-container').onclick = function (event) {
  event.preventDefault();
  shareboxContainer.className = '';
};
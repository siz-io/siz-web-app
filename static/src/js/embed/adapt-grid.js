var $ = document.querySelector.bind(document);

module.exports = function (story) {
  function adaptGrid() {
    var frameAspectRatio = document.body.clientWidth / document.body.clientHeight;
    var gridToLoad;
    if (frameAspectRatio < 1 && story.aspectRatio > 1) {
      gridToLoad = 'grid-4x1';
    } else if (frameAspectRatio > 1 && story.aspectRatio < 1) {
      gridToLoad = 'grid-1x4';
    } else {
      gridToLoad = 'grid-2x2';
    }
    $('#grid').className = gridToLoad;
  }
  window.onresize = adaptGrid;
  adaptGrid();
};
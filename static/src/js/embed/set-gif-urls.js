var $ = document.querySelector.bind(document);

module.exports = function (story) {
  var TO_4_GIFS_IDX_MATRIX = window.TO_4_GIFS_IDX_MATRIX = [
    [0, 0, 0, 0],
    [0, 1, 0, 1],
    [0, 1, 2, 2],
    [0, 1, 2, 3]
  ];

  function findGifUrl(box) {
    var url = '';
    box.formats.forEach(function (format) {
      if (format.type === 'gif') url = format.href;
    });
    return url;
  }

  for (var i = 0; i < 4; i++) {
    $('#gif' + i + ' .img-placeholder').style['background-image'] = 'url(' +
      findGifUrl(story.boxes[TO_4_GIFS_IDX_MATRIX[story.nBoxes - 1][i]]) + ')';
  }
};
import ajax from '../../lib/ajax';

const $ = document.querySelector.bind(document);
const stripCreatorElement = $('#strip-creator');
const editorBg = $('.editor-bg');
const stripPlaceholder = $('.strip-placeholder');
const stripShare = $('.strip-share');

const templateShareUrls = (selector, url) => {
  const el = $(selector);
  el.href = el.href.replace(/{encodedShareUrl}/, encodeURIComponent(url));
};

function findGifUrl(box) {
  var url = '';
  box.formats.forEach(function (format) {
    if (format.type === 'gif') url = format.href;
  });
  return url;
}

function fillLink(tag, url) {
  tag.innerHTML = url;
  tag.href = url;
}

const displayStrip = strip => {
  const slug = strip.slug;
  const stripUrl = window.location.protocol + '//' + window.location.host + '/stories/' + slug;
  const embedUrl = window.location.protocol + '//' + window.location.host + '/embed/' + slug;
  templateShareUrls('.share-sprite-facebook', stripUrl);
  templateShareUrls('.share-sprite-twitter', stripUrl);
  templateShareUrls('.share-sprite-mail', stripUrl);
  $('input.embed').value = $('input.embed').value.replace(/{embedUrl}/, embedUrl);
  editorBg.className = editorBg.className.replace(/collapsed/, '');
  stripPlaceholder.innerHTML = '<iframe src="/embed/' + slug + '" scrolling="no" frameborder="0" allowfullscreen></iframe>';
  stripShare.className += ' active';
  fillLink(stripShare.querySelector('#strip-url a'), stripUrl);
  stripShare.querySelector('#mp4-dl').href = strip.loop.formats[0].href;
  if (strip.boxes.length === 1) {
    stripPlaceholder.style['background-color'] = 'transparent';
    stripPlaceholder.style.height = '353px';
    stripPlaceholder.querySelector('iframe').className += ' one-gif';
    const gifTag = stripShare.querySelector('#gif-url');
    gifTag.style.display = 'block';
    fillLink(gifTag.querySelector('a'), findGifUrl(strip.boxes[0]));
  }
};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const checkStrip = id => ajax('/ajax/rpc/check-strip/' + id)
  .then(res => res.stories.length ? res.stories[0] : delay(500).then(checkStrip.bind(null, id)));

export default stripData => {
  stripData.tags = [];
  stripCreatorElement.className = 'active';
  editorBg.className += ' collapsed';
  stripPlaceholder.className += ' active';
  ajax('/factory/create-strip', {
      stories: [stripData]
    })
    .then(body => checkStrip(body.stories[0].id)
      .then(displayStrip));
};

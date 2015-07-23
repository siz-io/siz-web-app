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

const displayStrip = story => {
  const slug = story.slug;
  const link = window.location.protocol + '//' + window.location.host + '/stories/' + slug;
  const embedUrl = window.location.protocol + '//' + window.location.host + '/embed/' + slug;
  templateShareUrls('.share-sprite-facebook', link);
  templateShareUrls('.share-sprite-twitter', link);
  templateShareUrls('.share-sprite-mail', link);
  $('input.embed').value = $('input.embed').value.replace(/{embedUrl}/, embedUrl);
  editorBg.className = editorBg.className.replace(/collapsed/, '');
  stripPlaceholder.innerHTML = '<iframe src="/embed/' + slug + '" scrolling="no" frameborder="0" allowfullscreen></iframe>';
  stripShare.className += ' active';
  const linkTag = stripShare.querySelector('.link');
  linkTag.innerHTML = link;
  linkTag.href = link;
  if (story.boxes.length === 1) {
    stripPlaceholder.style['background-color'] = 'transparent';
    stripPlaceholder.querySelector('iframe').className += ' one-gif';
    const gifTag = stripShare.querySelector('#gif-dl');
    gifTag.style.display = 'inline-block';
    gifTag.href = findGifUrl(story.boxes[0]);
  }
};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const pingStrip = slug => ajax('/stories/' + slug).catch(() => delay(500).then(pingStrip.bind(null, slug)));

export default stripData => {
  stripData.tags = [];
  stripCreatorElement.className = 'active';
  editorBg.className += ' collapsed';
  stripPlaceholder.className += ' active';
  ajax('/factory/create-strip', {
      stories: [stripData]
    })
    .then(body => pingStrip(body.stories[0].slug)
      .then(displayStrip.bind(null, body.stories[0])));
};

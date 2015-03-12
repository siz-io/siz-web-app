/* jshint latedef: false */

var BROWSER = detectBrowser();
var IS_MOBILE = isMobile();
var STORY_SLUG = retrieveStorySlugFromUrl();
var SIZ_APP_URI = 'siz://stories/' + STORY_SLUG;
var BOX_WIDTH = 520;


function isMobile() {
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function retrieveStorySlugFromUrl() {
	var storySlugInUrlRegex = /^\/stories\/([a-z0-9A-Z-]{1,100})$/g;
	var storySlugRegex = /^#[a-z0-9A-Z-]{2,100}$/;

	var matches = storySlugInUrlRegex.exec(window.location.pathname);
	if (matches) return matches[1];
	if (storySlugRegex.test(window.location.hash)) return window.location.hash.substr(1);
	return '404';
}

function detectBrowser() {
	if (Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0) return 'safari';
	if (typeof InstallTrigger !== 'undefined') return 'firefox';
	if (!!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0) return 'opera';
	if (!!window.chrome) return 'chrome';
	if ( /*@cc_on!@*/ false || !!document.documentMode) return 'ie';
	return 'unknown';
}

function boxToDom(box) {
	if (['chrome', 'ie', 'safari', 'opera'].indexOf(BROWSER) > -1 && !IS_MOBILE) {
		return boxToDomVideo(box);
	}
	return boxToDomImg(box);
}

function heightRatio(width, height) {
	return Math.round(BOX_WIDTH * height / width);
}

function boxToDomVideo(box) {
	var video = document.createElement('video');
	video.width = BOX_WIDTH;
	video.height = heightRatio(box.width, box.height);
	video.class = 'box';
	video.loop = true;
	video.controls = false;
	video.autoplay = true;
	video.autobuffer = true;
	video.preload = true;

	for (var i = 0; i < box.formats.length; i++) {
		var format = box.formats[i];
		if (['mp4'].indexOf(format.type) > -1) {
			var source = document.createElement('source');
			source.src = format.href;
			source.type = 'video/' + format.type;
			video.appendChild(source);
		}
	}
	return video;
}

function boxToDomImg(box) {
	var image = document.createElement('img');
	image.class = 'box';
	box.formats.forEach(function (format) {
		if ('gif' === format.type) {
			image.src = format.href;
			image.width = BOX_WIDTH;
			image.height = heightRatio(box.width, box.height);
		}
	});
	return image;
}

function storyToDom(story) {
	var ret = document.createElement('div');
	story.boxes.forEach(function (box) {
		ret.appendChild(boxToDom(box));
	});
	return ret;
}

function playAllVideo() {
	var videos = document.getElementsByTagName('video');
	for (var i = 0; i < videos.length; i++) {
		videos[i].play();
	}
}

function youtubeToDom(source) {
	var iframe = document.createElement('iframe');
	iframe.width = '520';
	iframe.height = '315';
	iframe.src = 'https://www.youtube.com/embed/' + source.id;
	iframe.frameBorder = '0';
	iframe.allowfullscreen = true;
	return iframe;
}

function showStory(story) {
	var storyNode = document.getElementById('story_boxes');
	storyNode.parentNode.replaceChild(storyToDom(story), storyNode);
	if (story.source.type === 'youtube') {
		document.getElementById('story_video').appendChild(youtubeToDom(story.source));
	}
	playAllVideo();
}

function checkCustomURI() {
	var iframe = document.createElement('iframe');
	iframe.style.border = 'none';
	iframe.style.width = '1px';
	iframe.style.height = '1px';
	iframe.src = SIZ_APP_URI;
	document.body.appendChild(iframe);
}

function loadApp() {
	if ('safari' === BROWSER && IS_MOBILE) checkCustomURI();
	showStory(window._storyData);
}

loadApp();
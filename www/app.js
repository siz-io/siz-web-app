var API_ENDPOINT = 'https://api.siz.io';
var BROWSER = detectBrowser();
var STORY_SLUG = retrieveStorySlugFromUrl();

function retrieveStorySlugFromUrl(){
	var storySlugRegex = /^\/stories\/([a-z1-9A-Z-]{1,100})$/g;

	var matches = storySlugRegex.exec(window.location.pathname);
	if(matches != null)
		return matches[1];
	if(/^#[a-z1-9A-Z-]{2,100}$/.exec(window.location.hash) != null)
		return window.location.hash.substr(1);
	return '404';
}

function detectBrowser()
{
	if(Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0)
	{
		if( navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false )
		{
			return 'safari_ios';
		}
		return 'safari';
	}
	if(typeof InstallTrigger !== 'undefined')
		return 'firefox';
	if(!!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0)
		return 'opera';
	if(!!window.chrome)
		return 'chrome';
	if(/*@cc_on!@*/false || !!document.documentMode)
		return 'ie';	
	return 'unknown'
}

function retrieveToken()
{
	var request = new XMLHttpRequest();
	request.open('POST', API_ENDPOINT+'/tokens');
	request.setRequestHeader('Content-Type', 'application/json');
	request.onload = function() {
	    if (request.status === 201) {
	        var token = JSON.parse(request.responseText).tokens;
	        retrieveStory(token,STORY_SLUG)
	    }
	    else {
	    	showErrorStory();
	    }
	};
	request.onerror = function() {
	    showErrorStory();
	};
	request.send('{}');
}

function retrieveStory(token,slug)
{
	var request = new XMLHttpRequest();
	request.open('GET', API_ENDPOINT+'/stories?slug='+slug);
	request.setRequestHeader('X-Access-Token', token.id);
	request.setRequestHeader('Content-Type', 'application/json');
	request.onload = function() {
	    if (request.status === 200) {
	        var story = JSON.parse(request.responseText).stories;
	        showStory(story);
	    }
	    else {
	    	showErrorStory();
	    }
	};
	request.onerror = function() {
	    showErrorStory();
	};
	request.send();
}

function boxToDom(box)
{
	if(['chrome','ie','safari','opera'].indexOf(BROWSER) > -1)
	{
		return boxToDomVideo(box);
	}
	return boxToDomImg(box);
}

function videoFallback(video) {
    var div = document.createElement('div');
    div.innerHTML = video.innerHTML;
    video.parentNode.replaceChild(div, video);
}

function boxToDomVideo(box)
{
	var video = document.createElement('video');
	video.width = box.width;
	video.height = box.height;
	video.class = 'box';
	video.loop = true;
	video.controls = false;
	video.autoplay = true;
	video.autobuffer = true;
	video.preload = true;

	var sources = []
	for (var i=0; i<box.formats.length; i++){
		var format = box.formats[i];
		if(['mp4'].indexOf(format.type) > -1)
		{
			var source = document.createElement('source');
			source.src=format.href;
			source.type='video/'+format.type;
			video.appendChild(source);
		}
		else if('gif' === format.type)
		{
			var image = document.createElement('img');
			image.src = format.href;
			image.width = box.width;
			image.height = box.height;
			video.appendChild(image);
		}
	}
	return video;
}

function boxToDomImg(box)
{
	var image = document.createElement('img');
	image.class = 'box';
	box.formats.forEach(function(format) {
		if('gif' === format.type)
		{
			image.src = format.href;
			image.width = box.width;
			image.height = box.height;
		}
	});
	return image;
}


function addVideoFallback()
{
	var videos = document.querySelectorAll('video');
	for (var i=0; i<videos.length; i++){
		var video = videos[i],
		    sources = video.querySelectorAll('source'),
		        lastsource = sources[sources.length-1];
		lastsource.addEventListener('error', videoFallback(video), false);
	}
}

function storyToDom(story)
{
	var ret = document.createElement('div');
	story.boxes.forEach(function(box) {
		ret.appendChild(boxToDom(box));
		ret.appendChild(document.createElement('br'));
		ret.appendChild(document.createElement('br'));		
	});
	return ret;
}

function playAllVideo()
{
	var videos = document.getElementsByTagName('video')
	for (var i=0; i<videos.length; i++){
	  videos[i].play();
	}
}

function youtubeToDom(source)
{
	var iframe = document.createElement('iframe');
	iframe.width='520';
	iframe.height='315';
	iframe.src='https://www.youtube.com/embed/'+source.id;
	iframe.frameborder='0';
	iframe.allowfullscreen=true;
	return iframe;
}

function showErrorStory()
{
	document.getElementById('story_boxes').innerHTML = "Impossible to load your story. Try with the app.";
}

function showStory(story)
{	
	document.title = 'SIZ - '+story.title;
	document.getElementById('story_title').innerHTML = story.title;
	var storyNode = document.getElementById('story_boxes');
	storyNode.parentNode.replaceChild(storyToDom(story),storyNode);
	if(story.source.type === 'youtube')
	{
		document.getElementById('story_video').appendChild(youtubeToDom(story.source));
	}
	//addVideoFallback();
	playAllVideo();
}

retrieveToken()
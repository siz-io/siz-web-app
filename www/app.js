var API_ENDPOINT = "http://localhost:9000";
var BROWSER = detect_browser();
var STORY = "4-year-old-s-dream-of-being-ups-driver-comes-true";



function detect_browser(){
	if(Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0)
	{
		if( navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false )
		{
			return "safari_ios";
		}
		return "safari";
	}
	if(typeof InstallTrigger !== 'undefined')
		return "firefox";
	if(!!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0)
		return "opera";
	if(!!window.chrome)
		return "chrome";
	if(/*@cc_on!@*/false || !!document.documentMode)
		return "ie";	
	return "unknown"
}

function retrieve_token()
{
	var request = new XMLHttpRequest();
	request.open('POST', API_ENDPOINT+'/tokens');
	request.setRequestHeader('Content-Type', 'application/json');
	request.onload = function() {
	    if (request.status === 201) {
	        var token = JSON.parse(request.responseText).tokens;
	        retrieve_story(token,STORY)
	    }
	    else {
	    	alert("Unexpected answer")
	    }
	};
	request.send("{}");
}

function retrieve_story(token,slug)
{
	var request = new XMLHttpRequest();
	request.open('GET', API_ENDPOINT+'/stories?slug='+slug);
	request.setRequestHeader('X-Access-Token', token.id);
	request.setRequestHeader('Content-Type', 'application/json');
	request.onload = function() {
	    if (request.status === 200) {
	        var story = JSON.parse(request.responseText).stories;
	        show_story(story);
	    }
	    else {
	    	alert("Unexpected answer")
	    }
	};
	request.send();
}

function box_to_dom(box)
{
	if(['chrome','ie','safari','opera'].indexOf(BROWSER) > -1)
	{
		return box_to_dom_video(box);
	}
	return box_to_dom_img(box);
}

function video_fallback(video) {
    var div = document.createElement('div');
    div.innerHTML = video.innerHTML;
    video.parentNode.replaceChild(div, video);
}

function box_to_dom_video(box)
{
	var video = document.createElement('video');
	video.width = box.width;
	video.height = box.height;
	video.class = "box";
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
			source.type="video/"+format.type;
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

function box_to_dom_img(box)
{
	var image = document.createElement('img');
	image.class = "box";
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


function add_video_fallback()
{
	var videos = document.querySelectorAll('video');
	for (var i=0; i<videos.length; i++){
		var video = videos[i],
		    sources = video.querySelectorAll('source'),
		        lastsource = sources[sources.length-1];
		lastsource.addEventListener('error', video_fallback(video), false);
	}
}

function story_to_dom(story)
{
	var ret = document.createElement('div');
	story.boxes.forEach(function(box) {
		ret.appendChild(box_to_dom(box));
		ret.appendChild(document.createElement('br'));
		ret.appendChild(document.createElement('br'));		
	});
	return ret;
}

function play_all_video()
{
	var videos = document.getElementsByTagName("video")
	for (var i=0; i<videos.length; i++){
	  videos[i].play();
	}
}

function youtube_to_dom(source)
{
	var iframe = document.createElement("iframe");
	iframe.width="520";
	iframe.height="315";
	iframe.src="https://www.youtube.com/embed/"+source.id;
	iframe.frameborder="0";
	iframe.allowfullscreen=true;
	return iframe;
}

function show_story(story)
{	
	document.title = "SIZ - "+story.title;
	document.getElementById("story_title").innerHTML = story.title;
	var storyNode = document.getElementById("story_boxes");
	storyNode.parentNode.replaceChild(story_to_dom(story),storyNode);
	if(story.source.type === "youtube")
	{
		document.getElementById("story_video").appendChild(youtube_to_dom(story.source));
	}
	//add_video_fallback();
	play_all_video();
}

retrieve_token()
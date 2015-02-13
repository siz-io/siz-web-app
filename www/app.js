var API_ENDPOINT = "http://localhost:9000";
var BROWSER = detect_browser();

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
	        retrieve_story(token,"4-year-old-s-dream-of-being-ups-driver-comes-true")
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

function box_to_html(box)
{
	//if(['chrome'].indexOf(BROWSER) > -1)
		return box_to_html_video(box);
	return box_to_html_img(box);
}

function box_to_html_video(box)
{
	var ret = "<video width='"+box.width+"' height='"+box.height+"' class='story_box' loop preload autoplay controls>";
	box.formats.forEach(function(format) {
		if(['mp4'].indexOf(format.type) > -1)
		{
			ret += "<source src='"+format.href+"' type='video/"+format.type+"'></source>";
		}
		else if('gif' === format.type)
		{
			ret += "<image src='"+format.href+"' />";
		}
	});
	ret += "</video>";
	return ret;
}

function box_to_html_img(box)
{
	var ret = "";
	box.formats.forEach(function(format) {
		if('gif' === format.type)
		{
			ret += "<image src='"+format.href+"' />";
		}
	});
	return ret;
}

function video_fallback(video) {
    var div = document.createElement('div');
    div.innerHTML = video.innerHTML;
    video.parentNode.replaceChild(div, video);
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

function story_to_html(story)
{
	var ret = "";
	story.boxes.forEach(function(box) {
		ret += box_to_html(box);
		ret += "<br /><br />";
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

function show_story(story)
{	
	document.title = "SIZ - "+story.title;
	document.getElementById("story_title").innerHTML = story.title;
	document.getElementById("story_boxes").innerHTML = story_to_html(story);
	add_video_fallback();
	play_all_video();
}

retrieve_token()
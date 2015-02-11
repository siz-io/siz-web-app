var API_ENDPOINT = "http://localhost:9000";

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

function box_to_html(box, id)
{
	var ret = "<video width='"+box.width+"'' height='"+box.height+"' class='story_box' loop preload autoplay contextmenu='return false;'>";
	box.formats.forEach(function(format) {
		if(['mp4'].indexOf(format.type) > -1)
		{
			ret += "<source src='"+format.href+"' type='video/"+format.type+"'>";
		}
	});
 	ret += "Your browser does not support our story :(";
	ret += "</video>";
	return ret;
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

function show_story(story)
{	
	document.title = "SIZ - "+story.title;
	document.getElementById("story_title").innerHTML = story.title;
	document.getElementById("story_boxes").innerHTML = story_to_html(story);
}

retrieve_token()
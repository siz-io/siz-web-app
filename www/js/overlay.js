function start() {
    overlay();
    alertAndroid();
}

function overlay() {
    
    if((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))|| (navigator.userAgent.match(/iPad/i))) {
        document.getElementById("overlay").style.display="inline";
        document.getElementById("backtoapp").onclick = function(){
            document.getElementById("overlay").style.display="none";
            window.location.href="#story_video";
        }
    }
}

function alertAndroid() {
    
    
    if((navigator.userAgent.match(/Android/i)) ) {
    
        var r = confirm("We are searching for Beta Testers for our amazing Android app. Would you like to be part of it?");

        if (r == true) {
            window.location.href='http://siz-app.launchrock.com/';
        }
    }
}

function overlay() {
    
    if((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {
        document.getElementById("overlay").style.display="inline";
        document.getElementById("backtoapp").onclick = function(){
            document.getElementById("overlay").style.display="none";
            window.location.href="#story_video";
        }
    }
}

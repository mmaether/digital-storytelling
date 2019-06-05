/*----------------------------------------------------------------
Reading mode functions. 
The functions below will change the view of the page between 
night mode, day mode, and regular mode. Also fullscreen toggle.
----------------------------------------------------------------*/

//when user clicks toggle, toggle screen size
function toggleFullscreen() {
	console.log("Toggle function");
	//if the browser allows fullscreen
	if (screenfull.enabled) {
		
		//check if it's fullscreen or not
		if (!screenfull.isFullscreen) {
			screenfull.request();
		}
		else if (screenfull.isFullscreen) {
			screenfull.exit();
		}
		
	} else {
		// Ignore or do something else
		//requestFullscreen();
	}
}

function requestFullscreen() {
	var isMSIE = /*@cc_on!@*/0;
	
	//if it's in regular mode, make the browser fullscreen, change button
	if ($("#fullscreen-toggle").hasClass('fullscreen')) {
		$("#fullscreen-toggle").removeClass('fullscreen');
		$("#fullscreen-toggle").addClass('exit-fullscreen');
		//$('#tooltip-fullscreen').attr("data-hint", "Exit Full Screen");	
		
		if (isMSIE) {
			window.open(document.URL, "fs", "fullscreen=yes");
			$("#fullscreen-toggle").removeClass('fullscreen');
			$("#fullscreen-toggle").addClass('exit-fullscreen');
		}
		
		//modern browsers
		var docElm = document.documentElement;
		if (docElm.requestFullscreen) {
			docElm.requestFullscreen();
		}
		else if (docElm.mozRequestFullScreen) {
			docElm.mozRequestFullScreen();
		}
		else if (docElm.webkitRequestFullScreen) {
			docElm.webkitRequestFullScreen();
		}
		
	}
	
	//if it's in fullscreen mode, make the browser normal, change button
	else if ($("#fullscreen-toggle").hasClass('exit-fullscreen')) {
		console.log("Has exit");
		$("#fullscreen-toggle").removeClass('exit-fullscreen');
		$("#fullscreen-toggle").addClass('fullscreen');
		//$('#tooltip-fullscreen').attr("data-hint", "Full Screen");	
		
		//IE
		if (isMSIE) {
			window.open("kjlwefjwefjkle.htm", '_self');
			window.close();
		}
		
		//modern browsers
		if (document.exitFullscreen) {
			document.exitFullscreen();
		}
		else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		}
		else if (document.webkitCancelFullScreen) {
			document.webkitCancelFullScreen();
		}
	}
}



//this function is only for the normal mode. if it's clicked, the toggle-button will revert to night mode, all the extra classes (night or day) will be removed from body.
function normalMode(event) {
	$("body").removeClass();
	$("#toggle-button").removeClass();
	$("#toggle-button").addClass("night");
}


//this function changes it between night and day mode if the day/night mode toggle button is clicked
function toggleReadingMode(event) {
	$("body").removeClass();
	if ($("#toggle-button").hasClass("night")) {
		//add classes to change the text - black bg, white text
		$("body").addClass("Black_BG");
		$("body").addClass("White");
		
		//change the day-night button
		$("#toggle-button").removeClass();
		$("#toggle-button").addClass("day");
		
		//Change tooltip
		$('#toggle-tooltip').attr("data-hint", "Day Mode");		
	}
	else if ($("#toggle-button").hasClass("day")) {
		//add classes to change the text - white bg, black text
		$("body").addClass("White_BG");
		$("body").addClass("Black");
		
		//change the day-night button
		$("#toggle-button").removeClass();
		$("#toggle-button").addClass("night");
		
		//Change tooltip
		$('#toggle-tooltip').attr("data-hint", "Night Mode");
	}
}
/*--------------------------------------------------------------------------------------------------
    Digital Storytelling with Scroll Animations
    by Mike Maether

    This is part of my capstone project for RIT. This file essentially parses the user-created 
    XML file and spits it back out on the HTML page. This script correctly positions and styles
    the content to appear correctly. 

    SuperScrollorama plugin created by John Polacek.
    http://johnpolacek.github.io/superscrollorama/

    SuperScrollorama is powered by the Greensock Tweening Platform
    http://www.greensock.com
--------------------------------------------------------------------------------------------------*/

/*Arrays:
These arrays are needed because they will be accessed by multiple functions.*/

//scrollScriptArray is an array to hold the new script being created for the scrolling elements
var scrollScriptArray = [];
scrollScriptArray.push("<script type='text/javascript'>");
scrollScriptArray.push("/*This script is for the scrolling animations*/");
//if the window gets resized, make sure to re-trigger the animation placement
scrollScriptArray.push("$(window).resize(function(){controller.triggerCheckAnim();});");
scrollScriptArray.push("var controller = $.superscrollorama();");


//cssScriptArray is an array to hold the dynamically added CSS rules
var cssScriptArray = [];
cssScriptArray.push("<style>");


var classArray = [];


$(document).ready(function() {
	//make the ajax request to parse the XML file
	$.ajax({
		type: "GET",
		url: xmlStoryLocation,
		dataType: "xml",
		success: parseXML
	});
	/*Find any classes that has _BC or _FC, put the ID and class name in an array, then turn it on/off. 
	
	$(array).each(function() {
		$(ID).removeClass(_BC and _FC);
		$(ID).addClass(_BC and _FC);
	});
	*/
	
	
	
	$('#normal-mode').click(normalMode); 						//resets all classes on body
	$('#toggle-button').click(toggleReadingMode);				//changes day and night modes
	$("#loading").show();										//show the loading bar
	$("#fullscreen-toggle").click(toggleFullscreen);			//toggle for fullscreen
	
	//$(".fullscreen").click(fullscreen)
	//$(".exit-fullscreen").click(exitFullscreen)
	//$("#exit-fs").click(exitFullscreen)
	
	//if the screen can't be resized, hide it
	if (!screenfull.enabled) {
		$("#toggle-fullscreen").hide();
	}
	
	
	
	
	/*---------------------------------------
	--Create the spinning loading animation--
	---------------------------------------*/
	var opts = {
		lines: 11, // The number of lines to draw
		length: 20, // The length of each line
		width: 13, // The line thickness
		radius: 27, // The radius of the inner circle
		rotate: 0, // The rotation offset
		color: '#000', // #rgb or #rrggbb
		speed: 1, // Rounds per second
		trail: 60, // Afterglow percentage
		shadow: false, // Whether to render a shadow
		hwaccel: false, // Whether to use hardware acceleration
		className: 'spinner', // The CSS class to assign to the spinner
		zIndex: 2e9, // The z-index (defaults to 2000000000)
		top: 'auto', // Top position relative to parent in px
		left: 'auto' // Left position relative to parent in px
	};
	var spinner = new Spinner(opts).spin();
	$("#loading").append(spinner.el);
});






/*-----------------------------------------------------------------------------------------
function parseXML: 

This function is called from index.html. It reads the XML file and adds the proper code
to make it function correctly. This function will call the other functions to create the
controller for the scrolling animations and the style sheet.
-----------------------------------------------------------------------------------------*/
function parseXML(xml) {

    "use strict";
	$("#loading").hide();				//hide the loading animation
	$("#loading-text").hide();			//hide the loading text
    /*------------------------------------------------------------------------------------
    HTML Head:
    
    Any content that is suitable for the head will be parsed in this section. 
    This includes the title, the authors, and the favicon.
    -----------------------------------------------------------------------------------*/
    var headArray = [];

    //Title
	//headArray.push("<title>" + $(xml).find('about').find('title').text() + "</title>");
	document.title = $(xml).find('about').find('title').text();
    
	//loop for adding creators to the meta tag
    $(xml).find('about').find('creators').find('creator').each(function() {
	    headArray.push("<meta name='author' content='" + $(this).attr('creator_name') + "'>");
	});
	
	//Favicon
	if($(xml).find('overall_style').find('favicon')) {
		
		var faviconType = $(xml).find('overall_style').find('favicon').attr('file_format');
		var faviconHref = $(xml).find('overall_style').find('favicon').attr('href');
		
		if(faviconType == ".ico"){
			headArray.push("<link rel='shortcut icon' href='" + faviconHref + "'>");
		}
		else if(faviconType == ".gif"){
			headArray.push("<link rel='icon' type='image/gif' href='" + faviconHref + "'>");
		}
	}
	
	//Append to head so it doesn't overwrite stylesheets
	$('head').append(headArray.join(''));
	
	
	
	
	
	/*------------------------------------=-------------------------------------------------
	Title page:
	
	The user can choose to include a title page on their website with predetermined styling.
	This is an optional choice that the user can opt out of, but is convenient for having
	a consistent style for title pages. This includes the title, subtitle (if it exists), 
	and the creators. 
	--------------------------------------=-----------------------------------------------*/
	if ($(xml).find('about').attr('include_title_page') == "yes") {
		var titleArray = Array();
		
		titleArray.push("<div id='about-content'>");
		
		//Add title to title div
		titleArray.push("<h1>" + $(xml).find('title').text() + "</h1>");
		
		//Add subtitle if it exists
		if($(xml).find('subtitle')) {
			titleArray.push("<h2>" + $(xml).find('subtitle').text() + "</h2>");
		}
					
		/*Add the creators' names*/		
		//Create an array to hold the names of the creators so it can be joined properly
		var creatorsArray = Array();
		
		//loop to add every creator
		$(xml).find('about').find('creator').each(function(){
			creatorsArray.push($(this).attr('creator_name'));
		});
		
		titleArray.push("<h3>Created by " + creatorsArray.join(', ') + "</h3>");
		titleArray.push("</div>");		//close about-content div
		//$("#about-content").append(titleArray.join(''));
		$("#about").append(titleArray.join(''));
		
		//check for title styling in overall_style
		if ($(xml).find('overall_style').find('title_page_style')){
			
			//Call the appendClass function to append every class chosen to the title div
			appendClass($(xml).find('title_page_style'));	//call appendClass, pass through title page style
			var titleClassString = classArray.join(' ');	//join all the classes that are chosen
			$("#about").addClass(titleClassString);			//append class to container
			classArray = [];								//reset array for next class
		}
	}

	
	
	
	
	
	
	/*------------------------------------------------------------------------------
	Overall Style:
	
	The overall style will append all of the content from the overall_style section
	from the XML file. This includes the overall font defaults and the audio.
	------------------------------------------------------------------------------*/
	
	/*Overall Font
	All of the options for overall font are classes found in style.css, rather than creating
	them dynamically e.g. the cssStyling function. This section takes the chosen option,
	and adds the class to the div. It uses the appendClass function.*/
	if($(xml).find('overall_style')){
		
		if($(xml).find('overall_font')) { 
			//Call the appendClass function to append every class chosen to the scene div
			appendClass($(xml).find('overall_font'));	//call appendClass, pass through overall_font
			appendClass($(xml).find('overall_spacing'));
			var classString = classArray.join(' ');		//join all the classes that are chosen
			$("#container").addClass(classString);		//append class to container
			
			cssStyling("container", $(xml).find('overall_style').find('overall_font'));
			cssStyling("container", $(xml).find('overall_style').find('overall_spacing'));
		} //end of if overall_font exists
		
		if ($(xml).find('control_bar').attr('show_day_night_mode_toggle') == "no") { 
			$("#toggle-night-day").hide();
			$("#normal-mode").hide();
		}
		else { 
			$("#toggle-night-day").show();
			$("#normal-mode").show();
		}
	} //end of overall_style
	
	
	
	
	
	
	
	
	
	/*--------------------------------------------------------------------------------------------
	Audio:
	
	If the user wants audio to be included in their story, they have the option to include it.
	Two different formats are needed due to browser compatability. For more information on this,
	please check out: http://www.w3schools.com/html/html5_audio.asp#gsc.tab=0 
	I expect this issue to be resolved as browsers add more support, but as it stands, it's required
	for the user to include an .mp3 and either a .wav or an .ogg. 
	----------------------------------------------------------------------------------------------*/
	
	var audioOptionsArray = new Array();				//array to hold control options for audio element (i.e. autoplay, loop)
	var audioArray = new Array();						//array to hold the complete audio tag
	
	//add audio only if there is an audio element
	if($(xml).find('overall_style').find('audio').length){
	
		//check for autoplay and loop, add to array if yes
		if($(xml).find('audio').attr('autoplay') == "yes" ){
			audioOptionsArray.push("autoplay='true'");
		}
		if($(xml).find('audio').attr('loop') == "yes" ){
			audioOptionsArray.push("loop='true'");
		}
		
		//if there is autoplay or loop, add to audio div
		if(audioOptionsArray.length > 0) {audioArray.push("<audio id='audioplayer' controls " + audioOptionsArray.join(' ') + ">");}
		else {audioArray.push("<audio id='audioplayer' controls>");}
		
		var mp3Href = $(xml).find('mp3_file').attr('href');
		
		//check file formats, then add to html
		if( ($(xml).find('mp3_file').size() == 1) && ($(xml).find('wav_file').size() == 1)){
			audioArray.push("<source src='" + mp3Href + "' type='audio/mpeg'>");
			audioArray.push("<source src='" + $(xml).find('wav_file').attr('href') + "' type='audio/wav'>");
		}
		if( ($(xml).find('mp3_file').size() == 1) && ($(xml).find('ogg_file').size() == 1) ){
			audioArray.push("<source src='" + mp3Href + "' type='audio/mpeg'>");
			audioArray.push("<source src='" + $(xml).find('ogg_file').attr('href') + "' type='audio/ogg'>");
		}
		
		audioArray.push("Your browser does not support the audio element.");	//message if browser doesn't support HTML5 audio
		audioArray.push("</audio>");											//close audio tag
		$("#audio").html(audioArray.join(''));									//append audio
		
		
		//Have a Flash fallback for browsers that don't support HTML5 audio tags
		/*var audioTag = document.createElement('audio');
		if (!(!!(audioTag.canPlayType) && ("no" != audioTag.canPlayType("audio/mpeg")) && ("" != audioTag.canPlayType("audio/mpeg")))) {
			AudioPlayer.embed("audioplayer", {soundFile: mp3Href, width: 290});
		}*/
	}
	
	
	
	
	
	/*------------------------------------------------------------------------------
	The Story Itself:
	
	This is the bulk of the parsing. This will loop through the whole story to parse 
	and append the content added by the user. 
	----------------------------------------------------------------------------- */
	var sceneNumber = 1;					//keep tally of the scene number for the class
	var sceneArray = Array();				//array to hold each scene
	var sceneClassArray = Array();			//array to hold the classes for divs
	var scroll_id = "";						//string to hold the ID that links the scrolling animation to the element
	var textIDNum = 1;						//keep tally of the text ID number
	var imageIDNum = 1;						//keep tally of the image ID number
	
	
	
	
	
	
	
	
	
	//Loop through each scene.
	$(xml).find('story').find('scene').each(function(){
		
		/*-------------------------------------------------------------------------------------
		Scene
		
		This section will create the scene div and add any classes/styles to it. There aren't
		many, but the most notable ones are setting the height and background color. 
		-------------------------------------------------------------------------------------*/
		
		/*sceneNumberComplete is the combination of "scene" and the scene number, e.g. "scene2"
		This will make it easier to keep track of later when using the scene ID often.*/
		var sceneNumberComplete = "scene" + sceneNumber;		
		
		var sceneDivString = "<div id='" + sceneNumberComplete + "'";	//create scene div, leave it open in case user wants to add classes
		var sceneStyleArray = [];									//this array holds the css of the scene
		
		sceneStyleArray.push("#scene" + sceneNumber + "{")
		
		//Call the appendClass function to append every class chosen to the scene div
		appendClass($(this));
		
		if($(this).attr('height')){
			var sceneHeight = $(this).attr('height');
			sceneHeight = keepPosOnly(sceneHeight);
			sceneStyleArray.push("\theight: " + sceneHeight + "px;");
		}
		
		/*Borders*/
		//Border side
		var borderSide = "";
		if($(this).attr("border-side")) {
			borderSide = "border-" + $(this).attr('border-side');
			if ($(this).attr("border-side") == "all" ) {borderSide = "border";}
		}
		else { borderSide = "border"; }
		
		//Border color
		if($(this).attr("border-color")) {
			var borderColor = $(this).attr('border-color');
			sceneStyleArray.push("\t" + borderSide + "-color: " + borderColor + ";");
		}
		
		//Border style
		if($(this).attr("border-style")) {
			var borderStyle = $(this).attr('border-style');
			sceneStyleArray.push("\t" + borderSide + "-style: " + borderStyle + ";");
		}
		
		//Border width
		if($(this).attr("border-width")) {
			var borderWidth = $(this).attr('border-width');
			borderWidth = keepPosOnly(borderWidth) + "px;";
			sceneStyleArray.push("\t" + borderSide + "-width: " + borderWidth + ";");
		}
		
		//Overflow
		if ($(this).attr('overflow')) {
			var overflow = $(this).attr('overflow');
			sceneStyleArray.push("\toverflow: " + overflow + ";");
		}
		else {
			//If there are any elements that aren't in the window, it will hide it.
			sceneStyleArray.push("\toverflow: hidden;");
		}
		
		//BG color custom
		if ($(this).attr('background_color_custom')) {
			var bgColorCustom = $(this).attr('background_color_custom');
			sceneStyleArray.push("\tbackground-color: " + bgColorCustom + ";");
		}
		
		//Custom font color
		if ($(this).attr("font_color_custom")) {
			var fontColorCustom = $(this).attr("font_color_custom");
			sceneStyleArray.push("\tcolor: " + fontColorCustom + ";");
		}
		
		//If there are any classes, append it to div.
		if(classArray.length > 0){
			sceneDivString += " class='" + classArray.join(' ') + "'";
		}
		
		sceneDivString += ">";
		sceneArray.push(sceneDivString);
		classArray=[];							//reset array for next class grouping (e.g. text)

		
		
		
		//loop through all the children so you can add it in order (e.g. image then text, or text then image)
		$(this).children().each(function() {
			
			//if there is a text element
			//if ($(this).find('text')) {
			if ($(this).get(0).nodeName == "text") {
				
				//loop through all the texts
				//$(this).each(function() {
				
					
					//This creates text divs, adds the desired IDs and classes, then appends it to the HTML
						var textID = "text" + textIDNum;			//creates textID name, e.g. text4
						

						/*----------------
						----Functions-----
						----------------*/
						appendClass($(this));						//Call the appendClass function to append every class
						cssStyling(textID, $(this));				//send any styling options to cssStyling function

						//If there is an attached scrolling animation for the text div, send the data to the scrollScript function to create the controller lines.
						if($(this).find('text_scrolling_animation')){
							var scrollElement = $(this).find('text_scrolling_animation');	//get the whole text_scrolling_animation object
							scrollScript(textID, scrollElement);							//send ID and scrolling object to scrollScript function
						}
						
						
						
						//IMPORTANT! 
						//Create div for text, don't close it so we can add classes and ids
						var textDiv = "<div id='" + textID + "'";
						
						//If there are any classes, append it to div.
						if(classArray.length > 0){
							textDiv += " class='" + classArray.join(' ') + "'";
						}
						
						//close textDiv
						textDiv += ">";
						sceneArray.push(textDiv);
						
						
						
						/*----------WORK HERE-----------
						//if parallax is found, append their content.
						if($(this).find('text_scrolling_animation').find('parallax_group')){
							$(this).find('text_scrolling_animation').find('parallax_group').find('parallax_element').each(function() {
								console.log("Element: " + $(this).find('text_element').attr('text_content'));
							});
						}*/
						
						
						if($(this).find('text_content')){
							
							$(this).find('text_content').each(function(){
								
								/*------------------------------------------------------------------------------------------
								Mixed content
								
								JavaScript doesn't play too friendly with mixed content. Rather than being able to call 
								innerHTML, you need to tak a few extra steps. Essentially it turns it into a workable 
								string, from which you can manipulate by replacing the text. 
								------------------------------------------------------------------------------------------*/
								
								var xmlString;
								var xmlObject= this;
								
								while(xmlObject.nodeType!=1){xmlObject=xmlObject.nextSibling;}
								xmlString=(xmlObject.xml)?xmlObject.xml:(new XMLSerializer()).serializeToString(xmlObject);
								
								//Get rid of "<text_content>"
								xmlString = xmlString.replace("<text_content>", "");
								xmlString = xmlString.replace("</text_content>", "");
								
								
								//Bold
								if (xmlString.indexOf("<bold>") >= 0){
									var count = xmlString.match(/<bold>/g);  
									for(var i=0;i<count.length;i++){
										xmlString = xmlString.replace("<bold>", "<b>");
										xmlString = xmlString.replace("</bold>", "</b>");
									}
								}
								
								
								//Italic
								if (xmlString.indexOf("<italic>") >= 0){
									var count = xmlString.match(/<italic>/g);  
									for(var i=0;i<count.length;i++){
										xmlString = xmlString.replace("<italic>", "<i>");
										xmlString = xmlString.replace("</italic>", "</i>");
									}
								}
								
								//Bold italic
								if (xmlString.indexOf("<bold_italic>") >= 0){
									var count = xmlString.match(/<bold_italic>/g);  
									for(var i=0;i<count.length;i++){
										xmlString = xmlString.replace("<bold_italic>", "<b><i>");
										xmlString = xmlString.replace("</bold_italic>", "</i></b>");
									}
								}
								
								//Underlines
								if (xmlString.indexOf("<underline>") >= 0){
									var count = xmlString.match(/<underline>/g);  
									for(var i=0;i<count.length;i++){
										xmlString = xmlString.replace("<underline>", "<span style='text-decoration:underline'>");
										xmlString = xmlString.replace("</underline>", "</span>");
									}
								}
								
								//New lines/carriage returns
								if (xmlString.indexOf("<new_line/>") >= 0){
									var count = xmlString.match(/<new_line\/>/g);  
									for(var i=0;i<count.length;i++){
										xmlString = xmlString.replace("<new_line/>", "<br/>");
									}
								}
								//New lines/carriage returns (IE fix)
								if (xmlString.indexOf("<new_line />") >= 0){
									var count = xmlString.match(/<new_line \/>/g);  
									for(var i=0;i<count.length;i++){
										xmlString = xmlString.replace("<new_line />", "<br/>");
									}
								}
								
								//Horizontal rules (adding a horizontal line)
								if (xmlString.indexOf("<horizontal_rule/>") >= 0){
									var count = xmlString.match(/<horizontal_rule\/>/g);  
									for(var i=0;i<count.length;i++){
										xmlString = xmlString.replace("<horizontal_rule/>", "<hr/>");
									}
								}
								//Horizontal rules (IE fix)
								if (xmlString.indexOf("<horizontal_rule />") >= 0){
									var count = xmlString.match(/<horizontal_rule \/>/g);  
									for(var i=0;i<count.length;i++){
										xmlString = xmlString.replace("<horizontal_rule />", "<hr/>");
									}
								}
								
								//Extra spaces (won't be properly displayed from XML)
								if (xmlString.indexOf("<extra_space/>") >= 0){
									var count = xmlString.match(/<extra_space\/>/g);  
									for(var i=0;i<count.length;i++){
										xmlString = xmlString.replace("<extra_space/>", "&nbsp;");
									}
								}
								//Extra spaces (IE fix)
								if (xmlString.indexOf("<extra_space />") >= 0){
									var count = xmlString.match(/<extra_space \/>/g);  
									for(var i=0;i<count.length;i++){
										xmlString = xmlString.replace("<extra_space />", "&nbsp;");
									}
								}
								//Tabs (in case for indenting paragraphs)
								if (xmlString.indexOf("<tab/>") >= 0){
									var count = xmlString.match(/<tab\/>/g);  
									for(var i=0;i<count.length;i++){
										xmlString = xmlString.replace("<tab/>", "&nbsp;&nbsp;&nbsp;&nbsp;");
									}
								}
								
								//Tabs (IE fix, adds space)
								if (xmlString.indexOf("<tab />") >= 0){
									var count = xmlString.match(/<tab \/>/g);  
									for(var i=0;i<count.length;i++){
										xmlString = xmlString.replace("<tab />", "&nbsp;&nbsp;&nbsp;&nbsp;");
									}
								}
								
								//Font size
								if (xmlString.indexOf("<font-size") >= 0){
									var count = xmlString.match(/<font-size/g);  
									
									//For each instance of font size... 
									for(var i=0;i<count.length;i++){
										//Find the class name and separate it from the string
										var firstSplit = xmlString.split('font_size=');
										var secondSplit = firstSplit[1].split('>');
										var finalSplit = secondSplit[0];
										
										//Replace the quotes so we're left with the number, e.g. 44px
										var finalString = finalSplit.replace("\"", "");
										finalString = finalString.replace("px\"", "px");
										
										//Add the "fs_" for the CSS class
										finalString = "'fs_" + finalString + "'";
										
										/*finalSplit has quotes, finalString removes them.*/
										xmlString = xmlString.replace("<font-size font_size=" + finalSplit + ">", "<span class=" + finalString + ">");
										xmlString = xmlString.replace("</font-size>", "</span>");
									}
								}
								
								//Font color
								if (xmlString.indexOf("<font-color") >= 0){
									var count = xmlString.match(/<font-color/g);  
									
									//For each instance of font color... 
									for(var i=0;i<count.length;i++){
										//Find the class name and separate it from the string
										var firstSplit = xmlString.split('font_color_preset=');
										var secondSplit = firstSplit[1].split('>');
										finalSplit = secondSplit[0];
										
										//Replace the quotes so we're left with the color, e.g. White
										var finalString = finalSplit.replace("\"", "");
										finalString = finalString.replace("\"", "");
										
										/*finalSplit has quotes, finalString removes them.*/
										xmlString = xmlString.replace("<font-color font_color_preset=" + finalSplit + ">", "<span class=" + finalSplit + ">");
										xmlString = xmlString.replace("</font-color>", "</span>");
									}
								}
								
								
								//check if the user wants to add tabs in the overall_style section
								var includeTab = $(xml).find('overall_style').find('paragraph_spacing').attr('include_tab_for_every_text_content');
								var textPaddingBottom = $(xml).find('overall_style').find('paragraph_spacing').attr('padding-bottom');
								var fourSpaces = "";
								if (includeTab == "yes") {
									fourSpaces = "&nbsp;&nbsp;&nbsp;&nbsp;";
								}
								var paddingStyle = "";
								if (textPaddingBottom) {
									paddingStyle = keepPosOnly(textPaddingBottom);
									paddingStyle = " style='padding-bottom: " + paddingStyle + "px'";
								}
								
								//Whether or not there is any mixed content, append the text content.
								sceneArray.push("<p" + paddingStyle + ">" + fourSpaces + xmlString + "</p>");
							}); //end of each loop

						}

						
						sceneArray.push("</div>");					//Close the div for the array
						classArray=[];								//Reset class array so it doesn't affect other classes
						textIDNum++;								//Increment the text number
					
					
					
					
				//});		//end of texts loop
			} //end of if there are texts
			
			
			
			
			
			
			//if there are images
			if ($(this).get(0).nodeName == "image") {
				
					//Image loop
					var source = $(this).attr('source');
					var alt = $(this).attr('alt');
					var imageID = "image" + imageIDNum;

					//Send the loop and the imageID to the cssStyling function, which will create the style rules for each image.
					cssStyling(imageID, $(this));
					
		
					//NEED THIS CODE to ensure the text div has an ID
					//If there are any scrolling animations, send it to the scrollScript function to properly add the controller statements.
					if($(this).find('image_scrolling_animation')){
						var scrollElement = $(this).find('image_scrolling_animation');
						scrollScript(imageID, scrollElement);
					}
					
					//If there are any classes, append it to div.
					if(classArray.length > 0){
						textDiv += " class='" + classArray.join(' ') + "'";
					}
					
					//Create div for images
					sceneArray.push("<div id=" + imageID + ">");
					sceneArray.push("<img src='" + source + "' alt='" + alt + "'>");
					sceneArray.push("</div>");
					
					//increment imageIDNum for next image ID
					imageIDNum++;
					
			} //if there are images	
					
					
			/*------------------------------------------
			----- Background images - if they exist ----
			------------------------------------------*/
			if ($(this).get(0).nodeName == "background_image") {
				
				//Keep an empty array to hold all of the background properties
				var backgroundArray = Array();	
					
					
					//Check for every property
					var bgImageSource = $(this).attr('source');
					sceneStyleArray.push("\tbackground-image: url('" + bgImageSource + "');");
					
					//Check to see if there is any repeat attribute defined
					if($(this).attr('repeat')){
						sceneStyleArray.push("\tbackground-repeat: " + $(this).attr('repeat') + ";");
					}
					else {
						sceneStyleArray.push("\tbackground-repeat: repeat;");
					}
					
					//Background position
					if($(this).find('background_position')){
					
						//Background presets
						if($(this).find('background_position').find('bg_preset').length > 0){
						
							//We need to replace the original attribute to include spaces, e.g. 'center-bottom' becomes 'center bottom'
							var bgPreset = $(this).find('background_position').find('bg_preset').attr('position_presets');
							bgPreset = bgPreset.replace(/-/g, " ")
							sceneStyleArray.push("\tbackground-position: " + bgPreset+ ";");
							
							if ($(this).find('background_position').find('bg_preset').attr('fit_width') == "yes") {
								sceneStyleArray.push("\tbackground-size: 100%;");
							}
							
						}
						
						//Set background values
						else if ($(this).find('background_position').find('bg_set_values').length > 0){
							
							//check for if it's in percentage or pixels
							var percentageOrPixels = $(this).find('background_position').find('bg_set_values').attr('percentage_or_pixels');
							if(percentageOrPixels == "pixels"){
								percentageOrPixels = "px";
							}
							else if(percentageOrPixels == "percentage"){
								percentageOrPixels = "%";
							}
							
							
							//Retrieve the horizontal value
							var horizontalBgValue = "";
							if($(this).find('background_position').find('bg_set_values').find('horizontal').length > 0){
								horizontalBgValue = $(this).find('background_position').find('bg_set_values').find('horizontal').text();
								horizontalBgValue = keepPosOnly(horizontalBgValue) + percentageOrPixels;
								keepPosOnly(horizontalBgValue);
							}
							else {
								horizontalBgValue = 0 + percentageOrPixels;
							}
							
							
							//Retrieve the vertical value
							var verticalBgValue = "";
							if($(this).find('background_position').find('bg_set_values').find('vertical').length > 0){
								verticalBgValue = $(this).find('background_position').find('bg_set_values').find('vertical').text();
								verticalBgValue = keepPosOnly(verticalBgValue) + percentageOrPixels;
								keepPosOnly(verticalBgValue);
							}
							else {
								verticalBgValue = 0 + percentageOrPixels;
							}
							
							
							
							//Add values to background-position
							sceneStyleArray.push("\tbackground-position: " + horizontalBgValue + " " + verticalBgValue + ";");
						}
					} //end of background position
					
				//}); //loop through background image
			} //end of if background image exist
					
					
					
					
					
				
		}); //end of child loop
		
		//Close the CSS, add it to cssScriptArray					
					sceneStyleArray.push("}");
					var backgroundString = sceneStyleArray.join('\n');
					cssScriptArray.push(backgroundString);
		
		//end scene div, increment sceneNumber
		sceneArray.push("</div>");
		sceneNumber++;
		sceneNumberComplete++;
	});
	//end of story loop
	
	
	
	
	//append the complete scene to the story div
	$('#story').html(sceneArray.join(''));
	
	
	
	
	//close scrolling script before adding it
	scrollScriptArray.push("<\/script>");
	$("body").append(scrollScriptArray.join('\n'));
	
	

	
	
	/*----------------------------------------------------------------------
	Credits:
	
	At the end of each story, there will be a credits section. This will
	ensure that everyone involved with the story is given due credit. The 
	sections included are the creators, the sources, the date, and any other
	notes that are added. 
	--------------------------------------------------------------------- */
	var credits = [];
	/*Title*/
	credits.push("<div id='title-credits'><h2>" + $(xml).find('about').find('title').text() + "</h2>");
	/*Subtitle*/
	if($(xml).find('about').find('subtitle').length > 0){
		credits.push("<h3 style='border-bottom: 0; text-align: center; margin-top: 0;'>" + $(xml).find('about').find('subtitle').text() + "</h3>");
	}
	credits.push("</div>");
	
	
	/*Creators*/
	credits.push("<div id='creators-credits'><h3>Creators</h3>");
	$(xml).find('about').find('creator').each(function(){
		var creatorTypeString = "";
		if($(this).attr('creator_type') == "Audio"){creatorTypeString = "Audio";}
		if($(this).attr('creator_type') == "Author"){creatorTypeString = "Written";}
		if($(this).attr('creator_type') == "Creator"){creatorTypeString = "Created";}
		if($(this).attr('creator_type') == "Designer"){creatorTypeString = "Designed";}
		if($(this).attr('creator_type') == "Other"){creatorTypeString = "Other work";}
		
		var creatorName = $(this).attr('creator_name');
		
		//if the creator has a website
		if ($(this).attr('creators_website')){
			credits.push("<div id='creator'>" + creatorTypeString + " by <a href='" + $(this).attr('creators_website') + "' title=\"" + creatorName + "'s website\">" + creatorName + "</a></div>");
		}
		else{
			credits.push("<div id='creator'>" + creatorTypeString + " by " + creatorName + "</div>");
		}
	});
	credits.push("</div>");
	
	
	/*Sources*/
	if($(xml).find('about').find('source').length > 0) {
		credits.push("<div id='sources-credits'>");
		credits.push("<h3>Sources</h3>");
		
		$(xml).find('about').find('source').each(function(){
			
			//variables for source fields required
			var sourceTitle = $(this).attr('source_title');
			var sourceCreator = $(this).attr('source_creator');
			var sourceType = $(this).attr('source_type');
			credits.push("<div class='source'>");
			
			//if there's a URL for the source
			if ($(this).attr('source_link')) {
				credits.push("<a href='" + $(this).attr("source_link") + "' title=\"" + sourceTitle + "\" target='_blank'>" + sourceType + ": \"" + sourceTitle + "\" by " + sourceCreator + "</a>");
			}
			else {
				credits.push(sourceType + ": \"" + sourceTitle + "\" by " + sourceCreator);
			}
			if ($(this).attr('source_notes')) {
				credits.push("<div class='note'>\u27A5 Note: " +  $(this).attr('source_notes') + "</div>");
				/*Types of arrows:
				Regular arrow: \u2794
				Arrow curved up: \u27A5
				Arrow down, right angle: \u21b3*/
			}
			credits.push("</div>");
		});
		credits.push("</div>");
	}
	
	/*Other*/
	if($(xml).find('about').find('other').length > 0) {
		credits.push("<div id='other'><h3>Other</h3>");
		$(xml).find('about').find('other').each(function(){
			credits.push($(xml).find('about').find('other').text());
		});
		credits.push("</div>");
	}
	
	/*Tools*/
	credits.push("<h3>Tools</h3>");
	credits.push("<p>Digital storytelling</a> created by Mike Maether</p>");
	credits.push("<p><a href='http://johnpolacek.github.io/superscrollorama/' target='_blank'>SUPERSCROLLORAMA</a> by John Polacek</p>");
	
	/*Date*/
	var dateMonth = $(xml).find('about').find('date').attr('month');
	var dateDay = $(xml).find('about').find('date').attr('day');
	var dateYear = $(xml).find('about').find('date').attr('year');
	var totalDate = dateMonth + " " + dateDay + ", " + dateYear;
	credits.push("<div id='date-credits'>\u00A9 " + totalDate + "</div>");
			
	/*Credits - combine everything*/
	$("#credits").append(credits.join(''));
	
	
	
	
	
	
	//Close up many arrays and add them to HTML
	cssScriptArray.push("</style>");
	$("head").append(cssScriptArray.join('\n'));
	
	
	
	/*---------------------------------------------------------------------------------------
	--------------------------------------Pagination-----------------------------------------
	Automatically hide pagination. 
	If there are less scenes per page than the total amount, then include pagination.
	---------------------------------------------------------------------------------------*/
	$("#control-bar").find("#page-test").hide();
	var scenesPerPage = $(xml).find('overall_style').find('page_length').attr('number_of_scenes_on_page');
	var totalNumScenes = $(xml).find('scene').length;

	//include pagination, automatically display the number of scenes the user selected
	if (scenesPerPage < totalNumScenes) {
		var storyTitle = $(xml).find('about').find('title').text();
		$("footer").hide();
		pagination(scenesPerPage, totalNumScenes, storyTitle);
		//ensure that the title is set for pagination
		
		//then display the amount of scenes the user dictated (the hidden divs were completeds in pagination function a line above)
		for (var i = 1; i <= scenesPerPage; i++) {
			$("#story").find("#scene" + i).show();
		}
		document.title = $(xml).find('about').find('title').text();
	}
	//if the user chooses all scenes, show the footer, hide the pagination
	else if (scenesPerPage == "all") {
		$("footer").show();
		$(".pagination").hide();
	}
	else {
		$("footer").show();
		$(".pagination").hide();
	}
	
	
	//If the user hits left or right key, go to either previous or next page
	$("body").keydown(function(e) {
		if(e.keyCode == 37) { // left
			$('.pagination .previous').click();
			//ensure that the title is set for left nav
			document.title = $(xml).find('about').find('title').text();
		}
		else if(e.keyCode == 39) { // right
			$('.pagination .next').click();
			//ensure that the title is set for right nav
			document.title = $(xml).find('about').find('title').text();
		}
	});

	
	
	// THIS EVENT MAKES SURE THAT THE BACK/FORWARD BUTTONS WORK AS WELL
	window.onpopstate = function(event) {
		document.title = $(xml).find('about').find('title').text();
		
		//then display the amount of scenes the user dictated (the hidden divs were completeds in pagination function a line above)
		/*for (var i = 1; i <= scenesPerPage; i++) {
			$("#story").find("#scene" + i).show();
		}*/
		//console.log("pathname: " + location.pathname);
		//window.history.pushState(null, null, location.pathname);
		//pagination(scenesPerPage, totalNumScenes);
		//$('.pagination .next').click();
	}
	
	/*$('[data-rel=back]').live('click', function(){
	  console.log('headed back now');
    });
	
	
	$('a').click(function(e) {
        e.preventDefault();
        $.address.value($(this).attr('href'));
    });
    var changecount = 0;
    $.address.change(function(e) {
        if (typeof e !== 'function') {
            //$('span').html(changecount++);
			console.log("Change: " + changecount);
			changecount++;
        }
    });*/
	
	
	
	
	
} //end of function parseXML











function pagination(scenesPerPage, totalNumScenes, storyTitle){
	/*-------------------------------------------------------------
	After all of the content has been added, show the pagination.
	-------------------------------------------------------------*/
	//Show the pagination controls
	$(".pagination").show();
	
	//loop through all of the scenes and hide them all by default.
	for (var i=1; i <= totalNumScenes; i++) {
		$("#story").find("#scene" + i).hide();
	}
	
	//maxPages is the maximum amount of pages needed for pagination. 
	var maxPages = Math.ceil(totalNumScenes/scenesPerPage);
	
	
	
	
	//Force story title
	//window.top.document.title = storyTitle;
	document.title = storyTitle;
	
	
	
	
	//History.js to ensure that each AJAX page can be navigated properly
	// Prepare
	var History = window.History; // Note: We are using a capital H instead of a lower h
	if ( !History.enabled ) {
		 // History.js is disabled for this browser.
		 // This is because we can optionally choose to support HTML4 browsers or not.
		return false;
	}

	// Bind to StateChange Event
	History.Adapter.bind(window,'statechange',function(){ // Note: We are using statechange instead of popstate
		var State = History.getState(); // Note: We are using History.getState() instead of event.state
		//History.log(State.data, State.title, State.url);
	});
	
	
	//If there is pagination, automatically make the first page indicate ?page=1
	History.pushState(null, null, "?page=1");
	
	
	
	
	
	
	$('.pagination').jqPagination({
		//link_string	: '/?page={current_page}',
		max_page     : maxPages,
		paged        : function(page) { 
			//a new 'page' has been requested
			$("footer").hide();
			$("#about").hide();
			
			document.title = storyTitle;
			$("title").html(storyTitle);
			
			//loop through all of the scenes and hide them all.
			for (var i=1; i <= totalNumScenes; i++) {
				$("#story").find("#scene" + i).hide();
			}
			
			//Find the range of the records for the page: 
			var scenesFrom = scenesPerPage * (page-1) + 1;
			var scenesTo = scenesPerPage * (page);
						
			//then display only the records on the specified page
			for (var i = scenesFrom; i <= scenesTo; i++) {
				$("#story").find("#scene" + i).show();
			}
			
			//show the title on the first page, footer on the last page
			if (page == 1) {$("#about").show();}
			if (page == maxPages) {$("footer").show();}
			
			
			//any time the user hits the back or forward button, make it work with the history.
			/*$(window).bind("popstate", function() {
				var link = location.pathname.replace(/^.*[\\/]/, ""); // get filename only
				//console.log("Link: " + link);
			});*/

			
			//scroll to the top of the page if the page is changed
			
			$("html, body").animate({ scrollTop: 0 }, "fast");
			
			History.pushState(null, null, "?page=" + page);
			
		}
	});
}












/*--------------------------------------------------------------------------------
Function appendClass: 

This function will see if there are any classes that need to be added to a div, 
then add it to an array. The contents of the array will be added to the div in
the function parseXML. It's important for this function to pass the immediate 
element that needs classes appended. For example: 

textElement = <text balloon_styles="thought" class="demo1" font_size="42px" font_family="Baskerville" font_color="Black" background_color="White" z-index="20">
 
When calling this function, call appendClass(textElement);
--------------------------------------------------------------------------------*/
function appendClass(classElement){

	$(classElement).each(function(){
		//Balloon styles
		if($(this).attr('balloon_styles')){
			var balloonStyle = $(this).attr('balloon_styles');
			if(balloonStyle == "speech_left"){classArray.push("speech left");}
			if(balloonStyle == "speech_right"){classArray.push("speech right");}
			if(balloonStyle == "speech_bottom"){classArray.push("speech");}
			if(balloonStyle == "speech_top"){classArray.push("speech top");}
			if(balloonStyle == "thought"){classArray.push("thought");}
		}
		
		//Classes
		if($(this).attr('class')){
			classArray.push($(this).attr('class'));
		}
		
		//Font family
		if($(this).attr('font_family')){
			classArray.push($(this).attr('font_family'));
		}
		
		//Font color
		if($(this).attr('font_color_preset')){
			classArray.push($(this).attr('font_color_preset'));
		}
		
		//Background color
		if($(this).attr('background_color_preset')){
			//Include '_BG' at the end of background_color to indicate it's a background, as named in the CSS.
			classArray.push($(this).attr('background_color_preset') + "_BG");
		}
		
		//Font size
		if($(this).attr('font_size')){
			//Include 'fs_' before the class to indicate it's a 'font-size' class, as named in the CSS.
			classArray.push("fs_" + $(this).attr('font_size'));
		}
		//Text shadow
		if($(this).attr('text_shadow')){
			classArray.push($(this).attr('text_shadow'));
		}
	});
} //end of function appendClass















/*--------------------------------------------------------------------------------
Function cssStyling: 

This function will loop through and create a style sheet/rule for every element. 
--------------------------------------------------------------------------------*/
function cssStyling(divID, xmlLoop){
	
	//Open CSS element for image Div, automatically add relative positioning so we can move it with left, right, top, bottom.
	cssScriptArray.push("#" + divID + "{");
	cssScriptArray.push("\tposition: relative;");
	//cssScriptArray.push("\tposition: absolute;");
	//cssScriptArray.push("\tdisplay: inline-block;");
	
	if (divID !== "container") {
		cssScriptArray.push("\tdisplay: table;");
	}
	
	//Check for width
	if($(xmlLoop).attr('width')){
		var width = $(xmlLoop).attr('width');
		width = keepPosOnly(width);
		cssScriptArray.push("\twidth: " + width + "px;");
	}
	
	//If there is a z-index, place it in the CSS (ensure it's a number)
	if($(xmlLoop).attr('z-index')){
		var zIndex = $(xmlLoop).attr('z-index');
		zIndex = keepPosOnly(zIndex);
		cssScriptArray.push("\tz-index: " + zIndex + ";");
	}
	
	//Loop through all of the padding options
	//Left
	if($(xmlLoop).attr("padding-left")) {
		var paddingLeft = $(xmlLoop).attr('padding-left');
		paddingLeft = keepPosOnly(paddingLeft);
		cssScriptArray.push("\tpadding-left: " + paddingLeft + "px;");
	}
	//Right
	if($(xmlLoop).attr("padding-right")) {
		var paddingRight = $(xmlLoop).attr('padding-right');
		paddingRight = keepPosOnly(paddingRight);
		cssScriptArray.push("\tpadding-right: " + paddingRight + "px;");
	}
	//Top
	if($(xmlLoop).attr("padding-top")) {
		var paddingTop = $(xmlLoop).attr('padding-top');
		paddingTop = keepPosOnly(paddingTop);
		cssScriptArray.push("\tpadding-top: " + paddingTop + "px;");
	}
	//Bottom
	if ($(xmlLoop).attr("padding-bottom")) {
		var paddingBottom = $(xmlLoop).attr('padding-bottom');
		paddingBottom = keepPosOnly(paddingBottom);
		cssScriptArray.push("\tpadding-bottom: " + paddingBottom + "px;");
	}
	
	//Text align
	if ($(xmlLoop).attr("text-align")) {
		var textAlign = $(xmlLoop).attr("text-align");
		cssScriptArray.push("\ttext-align: " + textAlign + ";");
	}
	
	//Custom background color
	if ($(xmlLoop).attr("background_color_custom")) {
		var bgColorCustom = $(xmlLoop).attr("background_color_custom");
		cssScriptArray.push("\tbackground-color: " + bgColorCustom + ";");
	}
	
	//Custom font color
	if ($(xmlLoop).attr("font_color_custom")) {
		var fontColorCustom = $(xmlLoop).attr("font_color_custom");
		cssScriptArray.push("\tcolor: " + fontColorCustom + ";");
	}
	
	//Rotation
	if ($(xmlLoop).attr("rotation_in_degrees")) {
		var rotation = $(xmlLoop).attr("rotation_in_degrees");
		rotation = keepPosAndNeg(rotation);
		cssScriptArray.push("\t-webkit-transform: rotate(" + rotation + "deg);");
		cssScriptArray.push("\t-moz-transform: rotate(" + rotation + "deg);");
		cssScriptArray.push("\t-o-transform: rotate(" + rotation + "deg);");
		cssScriptArray.push("\t-ms-transform: rotate(" + rotation + "deg);");
	}
	
	//Margins
	if($(xmlLoop).attr("margin-left")) {
		var marginLeft = $(xmlLoop).attr('margin-left');
		marginLeft = keepPosOnly(marginLeft);
		cssScriptArray.push("\tmargin-left: " + marginLeft + "px;");
	}
	if($(xmlLoop).attr("margin-right")) {
		var marginRight = $(xmlLoop).attr('margin-right');
		marginRight = keepPosOnly(marginRight);
		cssScriptArray.push("\tmargin-right: " + marginRight + "px;");
	}
	if($(xmlLoop).attr("margin-top")) {
		var marginTop = $(xmlLoop).attr('margin-top');
		marginTop = keepPosOnly(marginTop);
		cssScriptArray.push("\tmargin-top: " + marginTop + "px;");
	}
	if($(xmlLoop).attr("margin-bottom")) {
		var marginBottom = $(xmlLoop).attr('margin-bottom');
		marginBottom = keepPosOnly(marginBottom);
		cssScriptArray.push("\tmargin-bottom: " + marginBottom + "px;");
	}
	
	
	/*Borders*/
	
	//Border side
	var borderSide = "";
	if($(xmlLoop).attr("border-side")) {
		borderSide = "border-" + $(xmlLoop).attr('border-side');
		if ($(xmlLoop).attr("border-side") == "all" ) {borderSide = "border";}
	}
	else { borderSide = "border"; }
	
	//Border color
	if($(xmlLoop).attr("border-color")) {
		var borderColor = $(xmlLoop).attr('border-color');
		cssScriptArray.push("\t" + borderSide + "-color: " + borderColor + ";");
	}
	
	//Border style
	if($(xmlLoop).attr("border-style")) {
		var borderStyle = $(xmlLoop).attr('border-style');
		cssScriptArray.push("\t" + borderSide + "-style: " + borderStyle + ";");
	}
	
	//Border width
	if($(xmlLoop).attr("border-width")) {
		var borderWidth = $(xmlLoop).attr('border-width');
		borderWidth = keepPosOnly(borderWidth) + "px;";
		cssScriptArray.push("\t" + borderSide + "-width: " + borderWidth + ";");
	}
	
	//Flipping a div
	var flip = $(xmlLoop).attr('flip');
	
	//horizontal|vertical|none
	if (flip == "horizontal") {
		cssScriptArray.push("\t-moz-transform: scaleX(-1);");
		cssScriptArray.push("\t-o-transform: scaleX(-1);");
		cssScriptArray.push("\t-webkit-transform: scaleX(-1);");
		cssScriptArray.push("\ttransform: scaleX(-1);");
		cssScriptArray.push("\tfilter: FlipH;");
		cssScriptArray.push("\t-ms-filter: 'FlipH';");
	}
	else if (flip == "vertical") {
		cssScriptArray.push("\t-moz-transform: scaleY(-1);");
		cssScriptArray.push("\t-o-transform: scaleY(-1);");
		cssScriptArray.push("\t-webkit-transform: scaleY(-1);");
		cssScriptArray.push("\ttransform: scaleY(-1);");
		cssScriptArray.push("\tfilter: FlipV;");
		cssScriptArray.push("\t-ms-filter: 'FlipV';");
	}
	
	
	/*------------------------------------------------------
	Positioning
	If there are positioning elements, place it in the CSS
	-------------------------------------------------------*/
	$(xmlLoop).each(function() {
		
		if($(this).find('positioning')){
			
			if($(this).find('positioning').find('position')){
				
				//this creates the direction, e.g. top: 5px;
				$(this).find('positioning').find('position').each(function(){
					var positionDirection = $(this).attr('direction');
					var positionValue = $(this).attr('value_in_pixels');
					positionValue = keepPosAndNeg(positionValue) + "px";
					
					
					/*If there is a scrolling animation, change the direction to a margin, otherwise there will be issues. 
					EXCEPT for simple fades. There is some issue with fades, where if margins are used instead of a direction, e.g. left or top, 
					then it will come out weird.*/
					//if ($(this).parent().parent().find('image_scrolling_animation').length > 0) {
					var findImgScroll = $(this).parent().parent().find('image_scrolling_animation');
					//if ($(findImgScroll).find('fade').length > 0) { console.log("Fade " + findImgScroll);}
					
					if ($(this).parent().parent().find('image_scrolling_animation').length > 0) {						
						//this variable tells if the direction will be positive or negative
						var positionPosOrNeg = "";
						
						//to move to the right, margin-left: 10px (right, positive)
						if (positionDirection == "move_to_the_right") { positionDirection = "left"; }
						
						//to move to the left, margin-left: -10px (left, negative)
						if (positionDirection == "move_to_the_left") { 
							positionDirection = "right"; 
							positionPosOrNeg = "-";
						}
						
						//to move upwards, margin-top: -10px (top and negative)
						if (positionDirection == "move_upwards") { 
							positionDirection = "top"; 
							positionPosOrNeg = "-";
						}
						
						//to move downwards, margin-top: 10px (top and positive)
						if (positionDirection == "move_downwards") { positionDirection = "top"; }
						cssScriptArray.push("\tmargin-" + positionDirection + ": " + positionPosOrNeg + positionValue + " !important;");
					}
					
					//If there aren't any animations, just set the direction, e.g. top, bottom
					else {						
						if (positionDirection == "move_to_the_right") { positionDirection = "left"; }
						if (positionDirection == "move_to_the_left") { positionDirection = "right"; }
						if (positionDirection == "move_upwards") { positionDirection = "bottom"; }
						if (positionDirection == "move_downwards") { positionDirection = "top"; }
						cssScriptArray.push("\t" + positionDirection + ": " + positionValue + ";");
					}
										
				});
			} //end of if there is position
			
			//Unless there is a position preset
			if($(this).find('positioning').find('preset_position')){
				$(this).find('positioning').find('preset_position').each(function(){
										
					//Get the horizontal value
					var presetHorizontal = $(this).attr('horizontal');
										
					//First check for the horizontal presets
					if(presetHorizontal == "left"){
						cssScriptArray.push("\tmargin-right: auto;");
					}
					if(presetHorizontal == "right"){
						cssScriptArray.push("\tmargin-left: auto;");
					}
					if(presetHorizontal == "center"){
						cssScriptArray.push("\tmargin: 0 auto;");
					}
					if(presetHorizontal == "none"){
						
					}

					
				});
				//if(){
					
				//}
			}
		} //end of if there is positioning
		else{
			
		}
		
		
	}); //end of XML loop
	
	
	cssScriptArray.push("}");
	
	
	//the following code ensures that for each text bubble, the proper color will be displayed.
	if($(xmlLoop).attr("balloon_styles") && ($(xmlLoop).attr("background_color_preset") || $(xmlLoop).attr("background_color_custom")) ) {
		
		var bgColor = "";
		
		//if there is a preset color, set the bgColor variable to it
		if ($(xmlLoop).attr('background_color_preset')) {
			bgColor = $(xmlLoop).attr("background_color_preset") + "_BG";
			//create a dummy div to grab the style
			var $el = $('<div class="' + bgColor +'"></div>');		
			bgColor = $el.css('backgroundColor');
		}
		//unless there is a custom color, then set the variable to that color
		else if ($(xmlLoop).attr('background_color_custom')) {
			bgColor = $(xmlLoop).attr("background_color_custom");
		}
		
		//for the border colors to be viewed properly, it needs to be either "transparent #color" or "#color transparent"
		var speechSide = $(xmlLoop).attr("balloon_styles");
		speechSide = speechSide.replace('speech_','');		
		
		var colorTrans = "";
		if(speechSide == "top" || speechSide == "bottom") {
			colorTrans = bgColor + " transparent";
		}
		else if (speechSide == "left" || speechSide == "right") {
			colorTrans = "transparent " + bgColor;
		}
		
		cssScriptArray.push("#" + divID + ":after {border-color: " + colorTrans + "}");
	}
	
} //end of cssStyling function
























/*---------------------------------------------------------------------------------
Function scrollScript: 

Every time a scroll animation element is found while looping through the
story, it will call this function and pass the ID of the div element being affected
(e.g. "text1" and the object of the scrolling animation. This function outputs the 
controller.addTween lines in the JavaScript file on the HTML page itself. 
---------------------------------------------------------------------------------*/
function scrollScript(scroll_id, scrollElement){
	
	//loop through the XML object (scrolling_animation)
	$(scrollElement).each(function(){
		var scrollAnimationName = $(this).children()[0].nodeName;
		
		
		
		/*Check for optional attributes that can tweak any animation. 
		If it doesn't exist, simply set the default. These effects include:
		the scroll duration, offset, and if there is a reverse animation or not.*/
		var scroll_duration = "";
		var scroll_offset = "";
		var scroll_reverse = "";
		
		//Scroll Duration
		if($(this).children().attr('duration')){
			scroll_duration = $(this).children().attr('duration');
			scroll_duration = keepPosAndNeg(scroll_duration);
		}
		else {scroll_duration = 0;}
		
		//Scroll Offset
		if($(this).children().attr('offset')){	
			scroll_offset = $(this).children().attr('offset');
			scroll_offset = keepPosAndNeg(scroll_offset);
		}
		else {scroll_offset = 0;}
		
		//Scroll Reverse
		if($(this).children().attr('reverse_animation')){
			scroll_reverse = $(this).children().attr('reverse_animation');
		}
		else {scroll_reverse = "true";}
		
		
		/*Opacity: 
		Opacity is an effect that can be applied to many animation effects, although isn't required. For this reason, 
		it will be added to the controller Tween before any other element. If there isn't an opacity, it will be 
		skipped over. That's also why a comma is added at the end.*/
		var opacity = "";
		if($(this).children().attr('opacity')){
			opacity = "opacity: " + $(this).children().attr('opacity') + ", ";
		}
		else{opacity = "opacity: 1,"};
		
		
		
		
		
		/*Fade animations
		Compatibility: text, images, scenes
		--------------------------------------------*/
		if (scrollAnimationName == "fade"){
		
			/*This is the opacity styling for the fade animation only. This is different from the previous one because: 
			1. The opacity should be 0 by default rather than 1, and 
			2. There shouldn't be a comma after the opacity amount. */ 
			if($(this).children().attr('opacity')){
				var opacityIn = $(this).children().attr('opacity');
			}
			else{opacityIn = "0";}
			
			//Controller statement
			scrollScriptArray.push("controller.addTween('#" + scroll_id + "', TweenMax.from( $('#" + scroll_id +"'), .5, {css:{opacity: " + opacityIn + "}}), " + scroll_duration + ", " + scroll_offset + ", " + scroll_reverse + ");");
		} //end of fade animation 
		
		
		
		
		
		
		/*Fly animations
		Compatibility: text, images, scenes
		--------------------------------------------*/
		if (scrollAnimationName == "fly"){
			
			var directionsArray = Array();
				
			//Find the value of each direction, keep only the numbers, add to an array
			if($(this).find('bottom').length){
				var bottomText = $(this).find('fly').find('direction_in_pixels').find('bottom').text();
				bottomText = keepPosAndNeg(bottomText);
				bottomText = "bottom: '" + bottomText + "px'";
				directionsArray.push(bottomText);
			}
			if($(this).find('top').length){
				var topText = $(this).find('fly').find('direction_in_pixels').find('top').text();
				topText = keepPosAndNeg(topText);
				topText = "top: '" + topText + "px'";
				directionsArray.push(topText);
			}
			if($(this).find('left').length){
				var leftText = $(this).find('fly').find('direction_in_pixels').find('left').text();
				leftText = keepPosAndNeg(leftText);
				leftText = "left: '" + leftText + "px'";
				directionsArray.push(leftText);
			}
			if($(this).find('right').length){
				var rightText = $(this).find('fly').find('direction_in_pixels').find('right').text();
				rightText = keepPosAndNeg(rightText);
				rightText = "right: '" + rightText + "px'";
				directionsArray.push(rightText);
			}
			
			var directionsString = directionsArray.join(', ');
			
			//Controller statement
			scrollScriptArray.push("controller.addTween('#" + scroll_id + "', TweenMax.from( $('#" + scroll_id + "'), .25, {css:{" + opacity + " " + directionsString + "}, ease:Quad.easeInOut}), " + scroll_duration + ", " + scroll_offset + ", " + scroll_reverse + ");");			
		
		} //end of Fly animation
		
		
		
		/*Spin animations
		Compatibility: text, images
		--------------------------------------------*/
		if (scrollAnimationName == "spin"){
			
			//Rotation
			var rotation = "rotation: " + $(this).children().attr('rotation_in_radians');
			
			//Controller statement
			scrollScriptArray.push("controller.addTween('#" + scroll_id + "', TweenMax.from( $('#" + scroll_id + "'), .25, {css:{" + opacity + " " + rotation + "}, ease:Quad.easeOut}), " + scroll_duration + ", " + scroll_offset + ", " + scroll_reverse + ");");
		
		} //end of spin animation
		
		
		
		
		/*Scale animations
		Compatibility: text
		--------------------------------------------*/
		if (scrollAnimationName == "scale"){
			
			//Size chages
			var fromSize = $(this).children().find('scale_from').attr('fontSize');
			var toSize = $(this).children().find('scale_to').attr('fontSize');
			
			//ensure that there are only positive numbers for the directions
			fromSize = keepPosOnly(fromSize);
			toSize = keepPosOnly(toSize);
			
			var fromSizeTotal = "fontSize: '" + fromSize + "px'"
			var toSizeTotal = "fontSize: '" + toSize + "px'";	
			
			
			
			//Opacities
			var fromOpacity = "";
			var toOpacity = "";
			
			//From opacity
			if($(this).children().find('scale_from').attr('opacity')){
				fromOpacity = "opacity: " + $(this).children().find('scale_from').attr('opacity') + ",";
			}
			else{fromOpacity = "opacity: 1,";}
			
			//To opacity
			if($(this).children().find('scale_to').attr('opacity')){
				toOpacity = "opacity: " + $(this).children().find('scale_to').attr('opacity') + ",";
			}
			else{toOpacity = "opacity: 1,";}
			
			
			
			//Controller statement
			scrollScriptArray.push("controller.addTween('#" + scroll_id + "', TweenMax.fromTo( $('#" + scroll_id + "'), .25, {css:{" + fromOpacity + " " + fromSizeTotal + "}, immediateRender:true, ease:Quad.easeInOut}, {css:{" + toOpacity + " " + toSizeTotal + "}, ease:Quad.easeInOut}), " + scroll_duration + ", " + scroll_offset + ", " + scroll_reverse + ");");

		} //end of scale animation
		
		
		
		/*Smush animations
		Compatibility: text
		--------------------------------------------*/
		if (scrollAnimationName == "smush"){
			//Size chages
			var fromLetterSpacing = $(this).children().find('smush_from').attr('letter_spacing');
			var toLetterSpacing = $(this).children().find('smush_to').attr('letter_spacing');
			
			//ensure that there are only positive numbers for the letter spacing
			fromLetterSpacing = keepPosOnly(fromLetterSpacing);
			toLetterSpacing = keepPosOnly(toLetterSpacing);
			
			var fromLetterSpacingTotal = "'letter-spacing': '" + fromLetterSpacing + "px'"
			var toLetterSpacingTotal = "'letter-spacing': '" + toLetterSpacing + "px'";	
			
			
			
			//Opacities attributes
			var fromOpacity = "";
			var toOpacity = "";
			
			//Opacity - smush from
			if($(this).children().find('smush_from').attr('opacity')){
				fromOpacity = "opacity: " + $(this).children().find('smush_from').attr('opacity') + ",";
			}
			else{fromOpacity = "opacity: 1,";}
			
			//Opacity - smush to
			if($(this).children().find('smush_to').attr('opacity')){
				toOpacity = "opacity: " + $(this).children().find('smush_to').attr('opacity') + ",";
			}
			else{toOpacity = "opacity: 1,";}
			
			
			
			//Controller statement
			scrollScriptArray.push("controller.addTween('#" + scroll_id + "', TweenMax.fromTo( $('#" + scroll_id + "'), .25, {css:{" + fromOpacity +  " " + fromLetterSpacingTotal + "}, immediateRender:true, ease:Quad.easeInOut}, {css:{" + toOpacity + " " + toLetterSpacingTotal + "}, ease:Quad.easeInOut}), " + scroll_duration + ", " + scroll_offset + ", " + scroll_reverse + ");");
			
		} //end of smush animation
		
		
		
		
		
		
		
		
		/*Parallax
		Compatibility: scene
		----------------------------------------*/
		if (scrollAnimationName == "parallax_group"){
					
			//parallaxString is the complete string for adding parallax elements
			//each element will be appended to the string in the loop
			var parallaxString = "controller.addTween('#" + scroll_id + "', (new TimelineLite()).append([";
			var parallaxArray = Array();
			var countPara = 1;
			
			$(this).find('parallax_group').each(function(){
				$(this).find('parallax_element').each(function(){
					
					//retrieve the directions from the user
					var fromParallax = $(this).find('direction > :first-child').attr('from');
					var toParallax = $(this).find('direction > :first-child').attr('to');
					
					//keep only the numbers (and also any negatives)
					fromParallax = keepPosAndNeg(fromParallax);
					toParallax = keepPosAndNeg(toParallax);
					
					console.log("Parallax: from = " + fromParallax);
					console.log("Parallax: to = " + toParallax);
					
					var fromParallaxSring = "";
					var toParallaxSring = "";
					
					//Left to right parallax
					if($(this).find('left_to_right').length){
						fromParallaxString = "left: " + fromParallax;
						toParallaxString = "right: " + toParallax;
					}
					//Right to left parallax
					if($(this).find('right_to_left').length){
						fromParallaxString = "right: " + fromParallax;
						toParallaxString = "left: " + toParallax;
					}
					//Top to bottom parallax
					if($(this).find('top_to_bottom').length){
						fromParallaxString = "top: " + fromParallax;
						toParallaxString = "bottom: " + toParallax;
					}
					//Bottom to top parallax
					if($(this).find('bottom_to_top').length){
						fromParallaxString = "bottom: " + fromParallax;
						toParallaxString = "top: " + toParallax;
					}
					
					
					
					
					//parallaxArray.push("TweenMax.fromTo($('#parallax-left'), 1, {css:{top: 200}, immediateRender:true}, {css:{top: -600}})");
					//parallaxString += "[TweenMax.fromTo($('#parallax-left'), 1, {css:{top: 200}, immediateRender:true}, {css:{top: -600}})";
					
					//scrollScriptArray.push("controller.addTween('#" + scroll_id + "', (new TimelineLite()).append([TweenMax.fromTo($('#" + parallax-left + "'), 1, {css:{" + cssSectionFrom + "}, immediateRender:true}, {css:{" + cssSectionTo + "}}), "
					//TweenMax.fromTo( $('#" + scroll_id + "'), .25, {css:{" + fromOpacity +  " " + fromLetterSpacingTotal + "}, immediateRender:true, ease:Quad.easeInOut}, {css:{" + toOpacity + " " + toLetterSpacingTotal + "}, ease:Quad.easeInOut}), " + scroll_duration + ", " + scroll_offset + ", " + scroll_reverse + ");"); 
					
					
					//parallaxArray.push("TweenMax.fromTo($('#" + parallax-it-left + "'), 1, {css:{" + fromParallaxString + "}, immediateRender:true}, {css:{" + toParallaxString + "}})");
					parallaxArray.push("TweenMax.fromTo($('#parallax-it"+countPara+"'), 1, {css:{" + fromParallaxString + "}, immediateRender:true}, {css:{" + toParallaxString + "}})");
					
					countPara++;
					
								/*TweenMax.fromTo($('#parallax-it-right'), 1, 
									{css:{top: 500}, immediateRender:true}, 
									{css:{top: -1250}})
							]),
						1000 // scroll duration of tween*/
					//);
					
					/*controller.addTween(
						'#examples-parallax',
						(new TimelineLite())
							.append([
								TweenMax.fromTo($('#parallax-it-left'), 1, 
									{css:{top: 200}, immediateRender:true}, 
									{css:{top: -600}}),
								TweenMax.fromTo($('#parallax-it-right'), 1, 
									{css:{top: 500}, immediateRender:true}, 
									{css:{top: -1250}})
							]),
						1000 // scroll duration of tween
					);
					
					
					
					controller.addTween(
						'#parallax', 
						(new TimelineLite())
							.append([
								TweenMax.fromTo($('#parallax-left'), 1, 
									{css:{top: 200}, immediateRender:true}, 
									{css:{top: -600}}), 
								TweenMax.fromTo($('#parallax-left'), 1, 
									{css:{top: 200}, immediateRender:true}, 
									{css:{top: -600}})
							]), 
						0, 0, true
					);*/
			
			
			
					
				}); //end of parallax element loop
				
				//need to close out each parallax grouping, add other attributes
				//parallaxArray.push("])," + scroll_duration + ", " + scroll_offset + ", " + scroll_reverse + ");");
				
			}); //end of parallax group loop
			
			
			//PROBLEM LINE!
			//parallaxArray.push("TweenMax.fromTo($('#parallax-left'), 1, {css:{top: 200}, immediateRender:true}, {css:{top: -600}})");
			parallaxString += parallaxArray.join(', ');
			parallaxString += "]), " + scroll_duration + ", " + scroll_offset + ", " + scroll_reverse + ");";
			console.log("Parallax string 1: " + parallaxString);
			
			

			//scrollScriptArray.push(parallaxString);
		
		} //end of if parallax elements exist
		
		
		
		/*Pin animation
		-----------------------------------*/
		if (scrollAnimationName == "pin"){
			//console.log("Pin found");
		} //end of pin animation
		if (scrollAnimationName == "slide"){
			//console.log("Slide found");
		} //end of slide animation
		if (scrollAnimationName == "wipe"){
			//console.log("Wipe found");
		} //end of wipe animation
		if (scrollAnimationName == "bounce"){
			//console.log("Bounce found");
		} //end of bounce animation
		if (scrollAnimationName == "color"){
			//console.log("Color found");
		} //end of color animation
		if (scrollAnimationName == "fling"){
			//console.log("Fling found");
		} //end of flying animation
		if (scrollAnimationName =="move"){
			//console.log("Move found");
		} //end of move animation
	}); //end of loop
} //end of function



/*-------------------------------------------------------------
function keepPosAndNeg and keepPosOnly
keepPosAndNeg = keep only the positive and negative numbers
keepPosOnly = keep only the positive number, no negatives

Due to DTD limitations, oftentimes there will be an element to 
enter whatever text the user wants, when it could help to limit
it to only numbers. For example, if you wanted to move an 
element 200px left, you would code:

<position direction="left" value_in_pixels="200px"/>

However, for value_in_pixels, the DTD cannot tell the user what
value to enter. (Actually, in the case of attributes it can, 
however to make it efficient I'd have to hard code values from 
-infinity to infinity, which I won't do.) As a work around, 
instead I'll call these functions which will strip the string 
of any characters that aren't letters (leaving only the letters), 
and then return the value
-------------------------------------------------------------*/

//Return both negative and positive values (e.g. 200 and -200)
function keepPosAndNeg(stringToReplace){
	stringToReplace = stringToReplace.replace(/[^0-9\-]/g, '');
	return stringToReplace
}


//Return only a positive number (e.g. 200, but NOT -200)
function keepPosOnly(stringToReplace){
	stringToReplace = stringToReplace.replace(/[^0-9]/g, '');
	return stringToReplace
}
// Global variables
var choiceHistory = new Array();	// Key value pair; choiceIDs and choiceChosen
var icons = new Array(); 			// Handle to loaded icons

var c;								// Handle to html canvas
var parser;
var xmlTimeline;
var videoQueue;
var queueIndex = 0;
var playhead; 
var isPlaying = false;
var timer; 

var tilePadding = 10;
var tileSize;
var tileWrapper = 120;
var timelineTopRatio = 0.6;
var imageTimer = 5000;

var tileColor = "#F7F0F0";
var tileFontColor = "#333";
var playheadColor = "#78CDD7";
var playStopColor = "#484349";
var playStopBackgroundColor = "#F7F0F0";

// Initialization
// ____________________________________
function init(){
	// Create a wrapper around canvas element.
	// Expand canvas to match window height and width. 
	c = new fabric.Canvas("canvas");
	c.setWidth(window.innerWidth); 

	// Allows for user to select XML file
	const fileSelector = document.getElementById('file-selector');
	fileSelector.addEventListener('change', (event) => {
		fileList = event.target.files;
		console.log(fileList);
		reader.readAsText(fileList[0]);
	});

	// Reads XML file once selected
	const reader = new FileReader();
	// reader.addEventListener('load', (event) => {

		//Once done, resize canvas to fit window and remove file input
		c.clear();
		c.setHeight(window.innerHeight * (1 / 2));				
		
		// document.getElementById("file-selector").style.display = "none";
		
		// document.getElementById("video").height = (window.innerHeight / 2);
		// document.getElementById("video").style.display = "block";

		// Parse XML Timeline
		parser = new DOMParser();
		// xmlTimeline = parser.parseFromString(event.target.result,"text/xml");
		let unexpectedGuest = "<timeline><tile><id>0</id><type>static</type><name>A Wish</name><videos><video><id>3</id><path>opening.mp4</path></video></videos></tile><tile><id>1</id><type>choice</type><name>Choice1</name><choices><choice><name>Call Feds</name><iconPath>choice_feds.png</iconPath><videos><video><id>26</id><path>passage_choice1a.mp4</path></video></videos><choiceID>1</choiceID><choiceChosen>2</choiceChosen></choice><choice><name>Call Media</name><iconPath>choice_media.png</iconPath><videos><video><id>27</id><path>passage_choice1b.mp4</path></video></videos><choiceID>1</choiceID><choiceChosen>4</choiceChosen></choice></choices></tile><tile><id>8</id><type>static</type><name>A Visitor</name><videos><video><id>10</id><path>passage1.mp4</path></video></videos></tile><tile><id>9</id><type>choice</type><name>Choice2</name><choices><choice><name>Talk To Creature</name><iconPath>choice_talk.png</iconPath><videos><video><id>16</id><path>passage_choice_1_a.png</path></video></videos><choiceID>9</choiceID><choiceChosen>10</choiceChosen></choice><choice><name>Shine Light</name><iconPath>choice_light.png</iconPath><videos><video><id>17</id><path>passage_choice_1_b.png</path></video></videos><choiceID>9</choiceID><choiceChosen>11</choiceChosen></choice><choice><name>Aim Gun</name><iconPath>choice_gun.png</iconPath><videos><video><id>18</id><path>passage_choice_1_c.png</path></video></videos><choiceID>9</choiceID><choiceChosen>12</choiceChosen></choice></choices></tile><tile><id>13</id><type>static</type><name>A Dilemma</name><videos><video><id>19</id><path>passage2_choice2a.mp4</path><condition><choiceID>9</choiceID><choiceChosen>10</choiceChosen></condition></video><video><id>20</id><path>passage2_choice2b.mp4</path><condition><choiceID>9</choiceID><choiceChosen>11</choiceChosen></condition></video><video><id>21</id><path>passage2_choice2c.mp4</path><condition><choiceID>9</choiceID><choiceChosen>12</choiceChosen></condition></video></videos></tile><tile><id>22</id><type>static</type><name>A Choice</name><videos><video><id>22</id><path>passage3_choice1a.mp4</path><condition><choiceID>1</choiceID><choiceChosen>2</choiceChosen></condition></video><video><id>23</id><path>passage3_choice1b.mp4</path><condition><choiceID>1</choiceID><choiceChosen>4</choiceChosen></condition></video></videos></tile><tile><id>14</id><type>choice</type><name>Choice3</name><choices><choice><name>Hide</name><iconPath>choice_hide.png</iconPath><videos><video><id>24</id><path>passage_choice3a.png</path></video></videos><choiceID>14</choiceID><choiceChosen>4</choiceChosen></choice><choice><name>Reveal</name><iconPath>choice_reveal.png</iconPath><videos><video><id>25</id><path>passage_choice3b.png</path></video></videos><choiceID>14</choiceID><choiceChosen>5</choiceChosen></choice></choices></tile><tile><id>11</id><type>static</type><name>An End</name><videos><video><id>27</id><path>ending_aaa.mp4</path><condition><choiceID>1</choiceID><choiceChosen>2</choiceChosen></condition><condition><choiceID>9</choiceID><choiceChosen>10</choiceChosen></condition><condition><choiceID>14</choiceID><choiceChosen>4</choiceChosen></condition></video><video><id>30</id><path>ending_aab.mp4</path><condition><choiceID>1</choiceID><choiceChosen>2</choiceChosen></condition><condition><choiceID>9</choiceID><choiceChosen>10</choiceChosen></condition><condition><choiceID>14</choiceID><choiceChosen>5</choiceChosen></condition></video><video><id>31</id><path>ending_aab.mp4</path><condition><choiceID>1</choiceID><choiceChosen>2</choiceChosen></condition><condition><choiceID>9</choiceID><choiceChosen>11</choiceChosen></condition><condition><choiceID>14</choiceID><choiceChosen>5</choiceChosen></condition></video><video><id>32</id><path>ending_aba.mp4</path><condition><choiceID>1</choiceID><choiceChosen>2</choiceChosen></condition><condition><choiceID>9</choiceID><choiceChosen>11</choiceChosen></condition><condition><choiceID>14</choiceID><choiceChosen>4</choiceChosen></condition></video><video><id>33</id><path>ending_aca.mp4</path><condition><choiceID>1</choiceID><choiceChosen>2</choiceChosen></condition><condition><choiceID>9</choiceID><choiceChosen>12</choiceChosen></condition><condition><choiceID>14</choiceID><choiceChosen>4</choiceChosen></condition></video><video><id>34</id><path>ending_acb.mp4</path><condition><choiceID>1</choiceID><choiceChosen>2</choiceChosen></condition><condition><choiceID>9</choiceID><choiceChosen>12</choiceChosen></condition><condition><choiceID>14</choiceID><choiceChosen>5</choiceChosen></condition></video><video><id>35</id><path>ending_baa.mp4</path><condition><choiceID>1</choiceID><choiceChosen>4</choiceChosen></condition><condition><choiceID>9</choiceID><choiceChosen>10</choiceChosen></condition><condition><choiceID>14</choiceID><choiceChosen>4</choiceChosen></condition></video><video><id>36</id><path>ending_bab.mp4</path><condition><choiceID>1</choiceID><choiceChosen>4</choiceChosen></condition><condition><choiceID>9</choiceID><choiceChosen>10</choiceChosen></condition><condition><choiceID>14</choiceID><choiceChosen>5</choiceChosen></condition></video><video><id>37</id><path>ending_bba.mp4</path><condition><choiceID>1</choiceID><choiceChosen>4</choiceChosen></condition><condition><choiceID>9</choiceID><choiceChosen>11</choiceChosen></condition><condition><choiceID>14</choiceID><choiceChosen>4</choiceChosen></condition></video><video><id>38</id><path>ending_bab.mp4</path><condition><choiceID>1</choiceID><choiceChosen>4</choiceChosen></condition><condition><choiceID>9</choiceID><choiceChosen>11</choiceChosen></condition><condition><choiceID>14</choiceID><choiceChosen>5</choiceChosen></condition></video><video><id>39</id><path>ending_bca.mp4</path><condition><choiceID>1</choiceID><choiceChosen>4</choiceChosen></condition><condition><choiceID>9</choiceID><choiceChosen>12</choiceChosen></condition><condition><choiceID>14</choiceID><choiceChosen>4</choiceChosen></condition></video><video><id>40</id><path>ending_bcb.mp4</path><condition><choiceID>1</choiceID><choiceChosen>4</choiceChosen></condition><condition><choiceID>9</choiceID><choiceChosen>12</choiceChosen></condition><condition><choiceID>14</choiceID><choiceChosen>5</choiceChosen></condition></video></videos></tile><tile><id>29</id><type>static</type><name>?</name><videos><video><id>29</id><path>end.png</path></video></videos></tile></timeline>";
		xmlTimeline = parser.parseFromString(unexpectedGuest,"text/xml");

		console.log(xmlTimeline); 
		
		// Preload images from timeline; once done, drawTimeline()				
		preloadImages(xmlTimeline, function (){
			drawTimeline(xmlTimeline);	
			drawPlayStopButton();		
			drawPlayhead();			
		});		
	// });	
}

// ____________________________________

function preloadImages(xml, callback) { 


	var xmlArray = xml.getElementsByTagName("tile");
	var numIcons = 0; 
	var numIconsLoaded = 0;

	// Counting number of images, one per choice tile
	for (var i = 0; i <= xmlArray.length - 1; i++) {
	// If of type choice...
		if (xmlArray[i].getElementsByTagName("type")[0].childNodes[0].nodeValue == "choice") {
			numIcons += xmlArray[i].getElementsByTagName("choices")[0].children.length;
		}
	}

	if(numIcons == 0) {
		callback();
		return; 
	}

	// Creating icon images, storing in icons array
	for (var i = 0; i <= xmlArray.length - 1; i++) {
		
		// If of type choice...
		if (xmlArray[i].getElementsByTagName("type")[0].childNodes[0].nodeValue == "choice") {
			
			// Get choices
			var choicesArray = xmlArray[i].getElementsByTagName("choices")[0].children;
			for (var j = choicesArray.length - 1; j >= 0; j--) {
				
				var imagePath = choicesArray[j].getElementsByTagName("iconPath")[0].childNodes[0].nodeValue;
				var img = new Image();
				img.src = "./assets/" + imagePath; 
				icons.push(img);

				img.onload = function(){ 
					// Increase number loaded, then check if it's the last image that needs loading
					numIconsLoaded += 1;
					if(numIconsLoaded >= numIcons) {
						// If so, draw timeline
						callback();
					}
				}
			}
		}

		

	}
}

function drawTimeline(xml){
	console.log("drawing timeline");
	
	var xmlArray = xml.getElementsByTagName("tile");	// Stores xml objects
	var tileArray = [];									// Stores fabric objects
	
	tileSize = tileWrapper - (tilePadding * 2);  		// Tile width without padding 
	c.setWidth(tileWrapper * xmlArray.length);
	
	// Keeping track of which icons to display
	var iconIndex = 0; 
	
	for (var i = 0; i <= xmlArray.length - 1; i++) {
		// Get tile type
		var type = xmlArray[i].getElementsByTagName("type")[0].childNodes[0].nodeValue;
		var label = xmlArray[i].getElementsByTagName("name")[0].childNodes[0].nodeValue;	
		var id = xmlArray[i].getElementsByTagName("id")[0].childNodes[0].nodeValue;		

		// If tile is of type "static", draw tile with icon
		if (type == "static") { 
			// Create a rectangle object
			var rect = new fabric.Rect({
				left: (tileWrapper * i) + tilePadding,
				originY: "center",
				top: c.height * timelineTopRatio,
				fill: tileColor,
				width: tileSize,
				height: tileSize,
				rx: 10,
				ry: 10,
				hoverCursor: "default",
				selectable: false,
				id: id
			});
			rect.set('shadow', new fabric.Shadow({
				blur: 10,
		        color: 'rgba(0,0,0,0.5)',
		        offsetX: 5,
		        offsetY: 5
			}));

			// Create tile label text
			var label = new fabric.Textbox(label, {
			  	left: (tileWrapper * i) + (tilePadding * 2),
				originY: "top",
				top: (c.height * timelineTopRatio) - (tileSize / 3) + tilePadding,
			  	fontSize: 14,
			  	fill: tileFontColor,
			  	width: tileSize - (tilePadding * 2),
			  	textAlign: "center",
			  	fontFamily: "Times",
			  	hoverCursor: "default",
			  	selectable: false
			});

			// If object clicked, update queueIndex and play
			rect.on({
				"mousedblclick": function(e){										
					// queueIndex = Math.floor(e.target.left / tileWrapper);					
					for (var j = xmlArray.length - 1; j >= 0; j--) {
						let id = xmlArray[j].getElementsByTagName("id")[0].childNodes[0].nodeValue;							
						if (id == e.target.id) {
							queueIndex = j;
							console.log("tapped: " + queueIndex);
							break;
						}
					}

					createVideoQueue();
					
					if (videoQueue[queueIndex].match(/.(jpg|jpeg|png|gif)$/i)) {
						showImage();
					}
					else {
						playVideo();	
					}					
				}
			});

			// Add fabric tile object to array
			tileArray.push(rect);
			tileArray.push(label);			
		}

		// If tile is of type "choice", draw choice column
		else if (type == "choice") {
			
			// Getting choices, storing in choicesArray
			var choicesArray = xmlArray[i].getElementsByTagName("choices")[0].children;
			var id = xmlArray[i].getElementsByTagName("id")[0].childNodes[0].nodeValue;	
			var verticalGroup = new fabric.Group([], {
				width: tileSize,
				height: tileSize * choicesArray.length * 2,
				left: (tileWrapper * i) + tilePadding,
				top: c.height * timelineTopRatio,
				originY: "center",
				lockMovementX: true,
				hasControls: false,
				hasBorders: false,
				id: id
			});

			for (var j = choicesArray.length - 1; j >= 0; j--) {
				// Create a rectangle object
				var rect = new fabric.Rect({
					originY: "center",
					originX: "center",
					top: 0 - (tileSize * j),
					fill: tileColor,
					width: tileSize,
					height: tileSize - 10,
					rx: 10,
					ry: 10,
					hoverCursor: "default",
					selectable: false
				});	
				rect.set('shadow', new fabric.Shadow({
					blur: 10,
			        color: 'rgba(0,0,0,0.5)',
			        offsetX: 5,
			        offsetY: 5
				}));
				
				// Add rect to vertical group
				verticalGroup.add(rect);

				// Adding icon for each choice			
				var img = new fabric.Image(icons[iconIndex], { 
					left: 0, 
					top: 0 - (tileSize * j), 
					// width: tileSize, 
					// height: tileSize - 10,
					originX: "center",
					originY: "center",
					scaleX: (tileSize - 10) / icons[iconIndex].width,
					scaleY: (tileSize - 10) / icons[iconIndex].width
				});	

				img.set('shadow', new fabric.Shadow({
					blur: 10,
			        color: 'rgba(0,0,0,0.5)',
			        offsetX: 5,
			        offsetY: 5
				}));			
				
				iconIndex++;  	
				verticalGroup.add(img);	
			}

			// Saving default choices
			var whichChoice = id; 
			var firstChoiceChosen = xmlArray[i].getElementsByTagName("choices")[0].children[0].getElementsByTagName("choiceChosen")[0].childNodes[0].nodeValue
			choiceHistory.push({id: whichChoice, choiceName: label, numChoices: choicesArray.length, choiceChosen: firstChoiceChosen});			

			// When verticalGroup modified, animate to selection and save choice
			verticalGroup.on({
				"moved": function(e){
					
					if (e.target) {
						
						// Stores the choice that's currently being manipulated
						var whichChoice = e.target.id;

						// Calculates which tile is selected for given choice
						var tileTop = (((e.target.top) - (c.height * timelineTopRatio)) / tileSize); 
						var whichTile = (tileTop % 1 > 0.5) ? Math.floor(tileTop) + 1 : Math.floor(tileTop);

						// Getting number of choices available 
						var numChoices = choiceHistory.find(choice => {return choice.id == whichChoice;}).numChoices;

						if(whichTile >= numChoices) { whichTile = numChoices - 1 }
						else if (whichTile < 0) { whichTile = 0; }

						// Animation
						var top = (c.height  * timelineTopRatio) + (tileSize * whichTile);
						e.target.animate(
							'top', 
							top,
							{
								duration: 300,
								onChange: c.renderAll.bind(c),
								easing: fabric.util.ease.easeOutBounce
							}
						);

						// Saving choice
						// console.log(whichChoice + " : " + whichTile);
						let choiceInHistory = choiceHistory.find(choice => {return choice.id == whichChoice;})
						let choiceIndex; 
						
						for (var l = 0; l < xmlArray.length; l++) {
							// console.log(xmlArray[l].getElementsByTagName("id")[0].childNodes[0].nodeValue);
							if(xmlArray[l].getElementsByTagName("id")[0].childNodes[0].nodeValue == choiceInHistory.id) {
								choiceIndex = l;
								break;
							}							
						}

						let choiceID = xmlArray[choiceIndex].getElementsByTagName("choices")[0].children[whichTile].getElementsByTagName("choiceChosen")[0].childNodes[0].nodeValue;

						console.log(choiceInHistory);
						console.log(choiceIndex);
						console.log(choiceID);

						choiceInHistory.choiceChosen = choiceID;
						console.log(choiceHistory);

					}
					
				}
			});

			verticalGroup.on({
				"mousedblclick": function(e){
					// queueIndex = Math.floor(e.target.left / tileWrapper);					
					for (var j = xmlArray.length - 1; j >= 0; j--) {
						let id = xmlArray[j].getElementsByTagName("id")[0].childNodes[0].nodeValue;							
						if (id == e.target.id) {
							queueIndex = j;
							console.log("tapped: " + queueIndex);
							break;
						}
					}

					createVideoQueue();
					
					if (videoQueue[queueIndex].match(/.(jpg|jpeg|png|gif)$/i)) {
						showImage();
					}
					else {
						playVideo();	
					}																			
				}
			});

			// Push group to tile array as next tile
			tileArray.push(verticalGroup);
			c.renderAll();
		}		
	}

	console.log(choiceHistory);

	for (var i = 0; i <= tileArray.length - 1; i++) {
		c.add(tileArray[i]);
	}

	c.renderAll();

	// Hiding image
	$("#picture").hide();
	if(isPlaying) { stopVideo(); }
}

function drawPlayStopButton() {	
	var top = 45; 

	// Play button
	var triangle = new fabric.Triangle({
		originY: "center",
		originX: "center",
    	width: 30, height: 30, left: c.width/2 - 40, top: top, fill: playStopColor
  	});

  	var circle = new fabric.Circle({
  		originY: "center",
		originX: "center",
    	radius: 30, left: c.width/2 - 40, top: top, fill: playStopBackgroundColor
  	});
  	circle.set('shadow', new fabric.Shadow({
		blur: 10,
        color: 'rgba(0,0,0,0.5)',
        offsetX: 10,
        offsetX: 10
	}));
  	triangle.rotate(90);

  	var playButton = new fabric.Group([circle, triangle], {
  	// var playButton = new fabric.Group([triangle], {
  		hasBorders: false,
  		hasControls: false,
  		hoverCursor: "pointer",
		selectable: false
  	});
	
  	c.add(playButton);
  	c.bringToFront(playButton);

  	playButton.on({"mouseup": function(e) {
  		queueIndex = -1;
  		nextMedia();
	}});

	// Stop button
	var circleStop = new fabric.Circle({
  		originY: "center",
		originX: "center",
    	radius: 30, left: c.width/2 + 40, top: top, fill: playStopBackgroundColor
  	});
  	circleStop.set('shadow', new fabric.Shadow({
		blur: 10,
        color: 'rgba(0,0,0,0.5)',
        offsetX: 10,
        offsetX: 10
	}));

	var rect = new fabric.Rect({
  		originY: "center",
		originX: "center",
    	width: 25, height: 25, left: c.width/2 + 40, top: top, fill: playStopColor
  	});

	var stopButton = new fabric.Group([circleStop, rect], {
	// var stopButton = new fabric.Group([rect], {
  		hasBorders: false,
  		hasControls: false,
  		hoverCursor: "pointer",
		selectable: false
  	});

  	c.add(stopButton);
  	c.bringToFront(stopButton);

  	stopButton.on({"mouseup": function(e) {
  		stopVideo();
	}});
}

function createVideoQueue() {
	var timeline = xmlTimeline.getElementsByTagName("tile");
	var videoPaths = new Array(); 
	var videoIndex = 0;
	console.log(choiceHistory);
	
	// Creating timeline of video paths
	while (videoIndex < timeline.length ) {

		// For static tiles...
		var type = timeline[videoIndex].getElementsByTagName("type")[0].childNodes[0].nodeValue;
		
		if(type == "static") {
			// Getting videos
			var videos = timeline[videoIndex].getElementsByTagName("videos")[0].children;
			
			// Getting conditions for each video
			for (var i = 0; i < videos.length; i++) {
				var conditions = videos[i].getElementsByTagName("condition"); 

				// If there're are no conditions, add this video path to queue; break. 
				if(conditions.length == 0) {
					videoPaths.push(videos[i].getElementsByTagName("path")[0].childNodes[0].nodeValue);
					break;
				}

				var meetsConditions = true; 
				// If conditions exist, add first video that meets conditions
				for(var j = 0; j < conditions.length; j++){
					var choiceID = conditions[j].getElementsByTagName("choiceID")[0].childNodes[0].nodeValue; 
					var choiceChosen = conditions[j].getElementsByTagName("choiceChosen")[0].childNodes[0].nodeValue; ; 

					// Check if condition is met; if not, change conditionFlag to false.
					let choice = choiceHistory.find(choice => {return choice.id == choiceID;});
					if (choice.choiceChosen != choiceChosen) { meetsConditions = false;}
				}

				//  If condition flag is still true, queue path and break				
				if(meetsConditions) {
					videoPaths.push(videos[i].getElementsByTagName("path")[0].childNodes[0].nodeValue);
					break;	
				}
				
			}			
		}

		// For choice tiles...
		else if(type == "choice") {
			
			// Getting choiceColumn
			let columnID = timeline[videoIndex].getElementsByTagName("id")[0].childNodes[0].nodeValue;
			let choiceChosenID = choiceHistory.find(choice => {return choice.id == columnID;}).choiceChosen;
			
			console.log(choiceChosenID);

			// Getting videos of selected choice			
			var choices = timeline[videoIndex].getElementsByTagName("choices")[0].children;						
			let choiceChosenIndex;
			for (var j = choices.length - 1; j >= 0; j--) {

				if(choices[j].getElementsByTagName("choiceChosen")[0].childNodes[0].nodeValue == choiceChosenID) {
					choiceChosenIndex = j;
					break;
				}
			}			

			let choice = timeline[videoIndex].getElementsByTagName("choices")[0].children[choiceChosenIndex]; 
			var videos = choice.getElementsByTagName("videos")[0].children;

			// Loop through each possible video...
			for (var i = 0; i < videos.length; i++) {
				// Get conditions for each video
				var conditions = videos[i].getElementsByTagName("condition"); 

				var meetsConditions = true; 
				// If conditions exist, add first video that meets conditions
				for(var j = 0; j < conditions.length; j++){
					var choiceID = conditions[j].getElementsByTagName("choiceID")[0].childNodes[0].nodeValue; 
					var choiceChosen = conditions[j].getElementsByTagName("choiceChosen")[0].childNodes[0].nodeValue; 

					// Check if condition is met; if not, change conditionFlag to false.
					let choice = choiceHistory.find(choice => {return choice.id == choiceID;});
					if (choice.choiceChosen != choiceChosen) { meetsConditions = false; }
				}

				//  If condition flag is still true, queue path and break				
				if(meetsConditions) {
					videoPaths.push(videos[i].getElementsByTagName("path")[0].childNodes[0].nodeValue);
					break;	
				}
			}
		}

		videoIndex++;
	}
	
	// Saving paths to global videoQueue
	console.log(videoPaths);
	videoQueue = videoPaths;		
}

function playVideo() {	
	// Getting video element
	var videoPlayer = document.getElementById("video");
	$("#picture").hide();	
	$("#video").show();			

	clearTimeout(timer);	

	// Setting source of video element to queue index
	videoPlayer.src = "./assets/" + videoQueue[queueIndex];

	// Playing video
	videoPlayer.play();
	movePlayhead(queueIndex);
	isPlaying = true;

	videoPlayer.onended = function() { nextMedia(); };
}

function nextMedia() {
	var videoPlayer = document.getElementById("video");
	clearTimeout(timer);

	createVideoQueue();
	queueIndex++;
	if(queueIndex < videoQueue.length) {

		if (videoQueue[queueIndex].match(/.(jpg|jpeg|png|gif)$/i)) {
			showImage();				
		}
		else {
			$("#picture").hide();	
			$("#video").show();	

			videoPlayer.src = "./assets/" + videoQueue[queueIndex];
			videoPlayer.play();
			isPlaying = true;
			console.log(videoQueue[queueIndex]);
			movePlayhead(queueIndex);	
		}			
	}
}

function stopVideo() {
	var videoPlayer = document.getElementById("video");
	if(isPlaying) {videoPlayer.pause();}


	$("#picture").hide();	
	$("#video").hide();	

	movePlayhead(0);
	isPlaying = false;
	clearTimeout(timer);
}

function showImage() {
	stopVideo();
	clearTimeout(timer);

	$("#picture").show();	
	$("#video").hide();	

	var picturePlayer = document.getElementById("picture");
	picturePlayer.src = "./assets/" + videoQueue[queueIndex];
	movePlayhead(queueIndex);

	isPlaying = false;

	// Set timer
	timer = setTimeout(function() {nextMedia();}, imageTimer);
}

function drawPlayhead() {
	playhead = new fabric.Rect();

	playhead.set({
  		originY: "center",
		originX: "center",
    	height: tileWrapper, 
    	width: tileWrapper,
    	left: tileWrapper / 2, 
    	top: c.height * timelineTopRatio,
    	rx: 10,
		ry: 10,
    	fill: playheadColor,
    	selectable: false,
    	hoverCursor: "default"

  	});

	c.add(playhead);
	playhead.sendToBack();
}

function movePlayhead(index) {

	playhead.animate(
		'left', 
		(tileWrapper * index) + (tileWrapper / 2),
		{
			duration: 1000,
			onChange: c.renderAll.bind(c),
			easing: fabric.util.ease.easeOutBounce
		}
	);
	c.renderAll();
	playhead.sendToBack();
}
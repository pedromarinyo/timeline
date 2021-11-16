// INIT
// __________________________________________________ 
// Authoring Interface
var timeline = new Array();
var selectedTile = null;
var selectedMedia = null;   
var ids = 5;   

// Authoring interface initialization
function init() {                
    // Creating an empty tile
    let emptyTimeline = new Array(
        {
            id: 0,
            type: "static",
            name: "Static Tile",
            mediaType: "image",
            media: new Array({id: 0, fileName: "sample.mp4", conditions: []})                    
        }       
    );             

    // Adding first element to empty array
    timeline = emptyTimeline;

    // Adding timeline length to id counter
    ids += timeline.length;

    // Drawing timeline                
    drawTimeline(timeline);

    // Allows for user to select XML file
    const fileSelector = document.getElementById('file-selector');
    fileSelector.addEventListener('change', (event) => {
        fileList = event.target.files;
        console.log(fileList);
        reader.readAsText(fileList[0]);
    });

    // Reads XML file once selected
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {              

        // Parse XML Timeline
        parser = new DOMParser();
        xmlTimeline = parser.parseFromString(event.target.result,"text/xml");
        // xmlTimeline = parser.parseFromString(relivingLastNight,"text/xml");

        console.log(xmlTimeline); 

        loadTimelineFromXML(xmlTimeline);
    
    }); 
}

// TIMELINE
// __________________________________________________
// Draw timeline from timeline array
function drawTimeline(timeline) {
    // Clearing timeline
    $("#timeline").html("");

    // Widening timeline to fit all tiles
    let width = 250 * timeline.length + 300;
    $("#timeline").width(width);

    // Drawing each tile in timeline
    timeline.forEach(drawTile);            
}


// TILES
// __________________________________________________
// Draw tile
function drawTile(item, index){
    // Declaring tileHTML
    let tileHTML = "";

    // Getting tile type
    switch(item.type) {

        // For static tiles...
        case "static":
            // Opening DIV
            tileHTML += "<div class='tile' id='" + item.id + "' onclick='selectTile(this)'>";

            // Creating add (plus) DIVS
            tileHTML += "<div class='displayNone deleteTile' onclick='deleteTile()'></div>";
            tileHTML += "<div class='displayNone addTileRight' onclick='addTile(true)'></div>";
            tileHTML += "<div class='displayNone addTileLeft' onclick='addTile(false)'></div>";
            tileHTML += "<div class='displayNone addChoiceBelow' onclick='addChoice()'></div>";

            // Tile name
            tileHTML += "<span class='tileName'>" + item.name + "</span><br>";

            // Calclating list of media and number of conditions per each
            let mediaList = "<span class='tileDetails'>";
            mediaList += "File Name : Conditions<br>";
            item.media.forEach(media => {

                for (var i = media.conditions.length - 1; i >= 0; i--) {                                   
                    // Finding tile associated with choiceID
                    let tileChoice = timeline.find(tile => { return tile.id == media.conditions[i].choiceID });
                    
                    // If tile doesn't exist, delete condition
                    if (typeof tileChoice == "undefined") {                                      
                        media.conditions.splice(i, 1);                                                                                                                    
                    }
                }

                mediaList += media.fileName + " : " + media.conditions.length + "<br>"; 
            });
            // Adding media list to tile
            tileHTML += mediaList;     
            // Closing media list span
            tileHTML += "</span>"                           

            // Closing DIV
            tileHTML += "</div>";            
            break;
        

        // For choice column tiles...
        case "choiceColumn":
            // Opening column DIV
            tileHTML += "<div class='choiceColumn')'>";

            item.choices.forEach(choice => {
                // Opening DIV
                tileHTML += "<div class='tile column tileChoice' id='" + choice.id + "," + choice.parentID + "' onclick='selectTile(this)'>";

                // Creating add (plus) DIVS
                tileHTML += "<div class='displayNone deleteTile' onclick='deleteTile()'></div>";
                tileHTML += "<div class='displayNone addTileRight' onclick='addTile(true)'></div>";
                tileHTML += "<div class='displayNone addTileLeft' onclick='addTile(false)'></div>";
                tileHTML += "<div class='displayNone addChoiceBelow' onclick='addChoice()'></div>";

                // Tile and choice name
                tileHTML += "<span class='tileName'>" + item.name + "</span>";
                tileHTML += "<span class='tileName'>" + choice.name + "</span>";
                
                // Tile icon
                if(choice.icon != null) { tileHTML += "<span class='tileName'>" + choice.icon + "</span>"; }
                

                // Calclating list of media and number of conditions per each
                let mediaList = "<br><span class='tileDetails'>";
                mediaList += "File Name : Conditions<br>";
                
                choice.media.forEach(media => {                                
                    
                    // Checking if condition choiceID still exists                                                                                            
                    for (var i = media.conditions.length - 1; i >= 0; i--) {                                   
                        // Finding tile associated with choiceID
                        let tileChoice = timeline.find(tile => { return tile.id == media.conditions[i].choiceID });
                        
                        // If tile doesn't exist, delete condition
                        if (typeof tileChoice == "undefined") {                                      
                            media.conditions.splice(i, 1);                                                                                                                    
                        }
                    }                                
                    mediaList += media.fileName + " : " + media.conditions.length + "<br>"; 
                });
                // Adding media list to tile
                tileHTML += mediaList;     
                // Closing media list span
                tileHTML += "</span>"                           

                // Closing DIV
                tileHTML += "</div>";
            }); 
            tileHTML += "</div>"; 
    
            break;
    }

    // Appending tile DIV to timeline outline DIV                
    $("#timeline").append(tileHTML);
}

// Select tile
function selectTile(tileNode) {
    // Removing tileSelected class from all tiles
    $(".tile").removeClass("tileSelected");
    $(".addTileRight").hide();
    $(".addTileLeft").hide();
    $(".addChoiceBelow").hide();
    $(".deleteTile").hide();                                                

    // Finding tile in timeline
    let tile; 
    let tileID = tileNode.id.split(","); 
    // If tileNode.id has one ID, this is a static tile 
    if(tileID.length == 1) {
        tile = timeline.find(tile => {return tile.id == tileNode.id});

        // Showing add tile buttons                 
        $("#" + tileNode.id).children(".deleteTile").show();
        $("#" + tileNode.id).children(".addTileRight").show();
        $("#" + tileNode.id).children(".addTileLeft").show();
        $("#" + tileNode.id).children(".addChoiceBelow").show();  

        // Adding selected style to tile DIV
        $("#" + tileNode.id).addClass("tileSelected"); 
    } 
    // If tileNode.id has two IDs, this is a choiceColumn
    else if (tileID.length == 2) {
        // Getting choiceColumn id (second number) and choice id (first number)
        let choiceColumnID = tileID[1];
        let choiceID = tileID[0];

        let choiceColumn = timeline.find(choiceColumn => {return choiceColumn.id == choiceColumnID});
        // Return if undefined (in case of deleting tile)                
        if(typeof choiceColumn == "undefined") {
            selectedTile = null;
            return; 
        }
        let choice = choiceColumn.choices.find(choice => {return choice.id == choiceID});
        tile = choice;                    

        // Showing add tile buttons                 
        $("#" + choiceID + "\\," + choiceColumnID).children(".deleteTile").show();
        $("#" + choiceID + "\\," + choiceColumnID).children(".addTileRight").show();
        $("#" + choiceID + "\\," + choiceColumnID).children(".addTileLeft").show();
        $("#" + choiceID + "\\," + choiceColumnID).children(".addChoiceBelow").show();  
        $("#" + choiceID + "\\," + choiceColumnID).addClass("tileSelected"); 
    }    

    // Return if undefined (in case of deleting tile)                
    if(typeof tile == "undefined") {
        selectedTile = null;
        return; 
    }            

    // Saving tile to selectedTile global variable
    selectedTile = tile;                            

    // Hiding dialogues
    hideInspectorButtons();

    // Showing inspector with selected tile info
    showInspector();                                            
}            

// Add a tile
function addTile(isRight) {
    // Getting index of selectedTile global
    let tileID; 
    if(selectedTile.type == "choice") {tileID = selectedTile.parentID;}
    else if (selectedTile.type == "static") {tileID = selectedTile.id;}

    let tileIndex = timeline.indexOf(timeline.find(tile => {return tile.id == tileID}));                

    // Creating an empty tile
    ids++;
    let emptyTile =  {
            id: ids,
            type: "static",
            name: "Static Tile",
            mediaType: "image",
            media: new Array()
        }
    
    // Splicing empty tile after 
    if (isRight) {
        timeline.splice(tileIndex + 1, 0, emptyTile);
    }
    // or before tile
    else {
        timeline.splice(tileIndex, 0, emptyTile);
    }

    drawTimeline(timeline);
}

// Delete a tile
function deleteTile(){
    // If a static tile...
    if (selectedTile.type == "static") {                                        
        // Getting tile index in timeline
        let tileIndex = timeline.indexOf(selectedTile);

        // Clearing selected tile and media
        selectedTile = null;
        selectedMedia = null; 

        // Splicing tile out of timeline
        timeline.splice(tileIndex, 1);
    }

    // If a choice tile...
    else if (selectedTile.type == "choice") {
        // Getting choice column by id
        let choiceColumn = timeline.find(choiceColumn => {return choiceColumn.id == selectedTile.parentID});
        let choiceColumnIndex = timeline.indexOf(choiceColumn);

        // Getting choice by id
        let choice = choiceColumn.choices.find(choice => {return choice.id == selectedTile.id});
        let choiceIndex = choiceColumn.choices.indexOf(choice);

        // Removing choice
        choiceColumn.choices.splice(choiceIndex, 1);

        // If no choices left, remove choice column
        if (choiceColumn.choices.length == 0) {
            timeline.splice(choiceColumnIndex, 1);
        }
    }                

    // If no tiles left, add empty tile
    if(timeline.length == 0) {
        let emptyTile =  {
            id: ids++,
            type: "static",
            name: "Static Tile",
            mediaType: "image",
            media: new Array()
        }
        timeline.push(emptyTile);    
    }
    
    // Removing selectedTile global
    selectedTile = null;

    // Refreshing timeline
    drawTimeline(timeline);

    // Refreshing inspector
    hideInspector();

    // Hiding media editor
    hideConditionEditor();
}

// Add a choice
function addChoice() {
    
    // Changing selectedTile global to type choice
    // If static tile...
    if (selectedTile.type == "static") {
        ids++;
        let emptyChoiceColumn = {
            id: selectedTile.id,
            type: "choiceColumn",
            name: "Choice Column",
            choices: new Array(
                {
                    id: ids,
                    parentID: selectedTile.id,
                    name: "Choice " + ids,
                    type: "choice",
                    mediaType: "image",  
                    icon: "sample.png",                  
                    media: new Array()
                }                
            )
        };

        // Saving new empty choice column to selectedTile
        let tileIndex = timeline.indexOf(timeline.find(tile => {return tile.id == selectedTile.id}));
        timeline.splice(tileIndex, 1, emptyChoiceColumn);                    
    }
    // If choice tile...
    else if(selectedTile.type == "choice") {
        // Getting parent choiceColumn
        let choiceColumn = timeline.find(choiceColumn => {return choiceColumn.id == selectedTile.parentID});
        let choiceIndex = choiceColumn.choices.indexOf(choiceColumn.choices.find(choice => {return choice.id == selectedTile.id}));


        // Pushing empty choice into choiceColumn
        ids++;
        let emptyChoice = {
            id: ids,
            parentID: choiceColumn.id,
            name: "Choice " + ids,
            type: "choice",
            mediaType: "image",
            icon: "sample.png",
            media: new Array()
        };
        choiceColumn.choices.splice(choiceIndex + 1, 0, emptyChoice);
    }                            

    hideInspector();
    drawTimeline(timeline);
    console.log(timeline);
}

// INSPECTOR
// __________________________________________________
// Inspect tile
function showInspector() {
    let tile = selectedTile;              

    // If tile is of type choice, find the choice
    if(tile.type == "choiceColumn") {
        slectedTile = null; 
        return;
    }                  

    // Showing selected tile's name in inspector
    $("#inspectorTileName").html(tile.name);

    $("#inspectorIcon").html("");
    if(selectedTile.type == "choice" && selectedTile.icon != null) {$("#inspectorIcon").html("Icon: " + selectedTile.icon);}

    // Creating media list
    let mediaList = "";                
    tile.media.forEach(media => {           
        // Showing file name
        mediaList += "<div class='inspectorTile' id='" + media.id + "' onclick='selectMedia(this)'>";
        mediaList += "<div class='deleteInspectorTile' id='" + media.id + "' onclick='deleteMedia(this)'></div>";
        mediaList += "<span class='fileName'>" + media.fileName + "</span>";

        // Clearing inspectorMedia DIV
        $("#inspectorMedia").html("");

        // Appending conditions to inspectorMedia DIV   
        media.conditions.forEach(condition => { 
            // Getting name of tile from choice ID
            let tile = timeline.find(tile => {return tile.id == condition.choiceID});
            let choice = tile.choices.find(choice => {return choice.id == condition.value});

            // Opening condition span
            mediaList += "<span class='condition'>";
            
            
            mediaList += tile.name + " | ";

            // Appending choice value
            mediaList += choice.name;  

            // Closing condition span
            mediaList += "</span>";                    
        }); 

        // Closing media DIV
        mediaList += "</div>";                    
    });
    
    // Appending list to media DIV
    $("#inspectorMedia").append(mediaList);                            

    // Adding mediaList HTML to inspectorMedia
    $("#inspectorMedia").html(mediaList);

    // Showing inspector, hiding others
    $("#inspector").fadeIn(100);            
    hideInspectorButtons();

    // Showing add media button and update name buttons
    $("#addMediaButton").show();
     $("#updateNameButton").show();

    // Showing change column name button if choiceColumn
    if(selectedTile.type == "choice") {
        $("#updateColumnNameButton").show();
        $("#addIconButton").show();
    } else {
        $("#updateColumnNameButton").hide();
        $("#addIconButton").hide();
    }
}

// Hiding inspector
function hideInspector(){
    // Removing tileSelected class from all tiles
    $(".tile").removeClass("tileSelected");
    $(".addTileRight").hide();
    $(".addTileLeft").hide();
    $(".addChoiceBelow").hide();
    $(".deleteTile").hide();

    // Hiding inspector
    $("#inspector").hide();

    // Clearing selectedTile global
    selectedTile = null;
    selectedMedia = null;                 
}

// Hiding inspector buttons
function hideInspectorButtons() {
    hideConditionEditor();   
    hideUpdateName();
    hideUpdateColumnName();
    hideAddIcon();
    hideAddMedia();
    hideAddCondition();

    $("#addMediaButton").hide();
    $("#addIconButton").hide();
    $("#addConditionButton").hide();
    $("#updateNameButton").hide();
    $("#updateColumnNameButton").hide();
}

// Showing inpector buttons
function showingInspectorButtons() {
    $("#addMediaButton").show();
    $("#addIconButton").show();    
    $("#updateNameButton").show();
    
    if(selectedTile != null) {
        if (selectedTile.type == "choice") { 
            $("#updateColumnNameButton").show(); 
            $("#addIconButton").show(); 
        }    
        else {
            $("#updateColumnNameButton").hide(); 
            $("#addIconButton").hide(); 
        }
    }    
}

// Show update name dialogue
function showUpdateName() {
    hideInspectorButtons();
    document.getElementById("updateNameInput").value = selectedTile.name;
    $("#updateName").show();    
    
}
// Hide add media dialogue
function hideUpdateName() {
    $("#updateName").hide();    
}
// Update tile name    
function updateName() {
    // Getting file name from input field
    let tileName = document.getElementById("updateNameInput").value; 
    
    // Pushing new media object with file name to timeline                                
    selectedTile.name = tileName;

    // Hiding add media dialogue
    hideUpdateName();

    // Refreshing timeline
    drawTimeline(timeline);

    // Refreshing inspector
    showInspector(selectedTile);
} 

// Show update name dialogue
function showUpdateColumnName() {
    hideInspectorButtons();

    // Finding choiceColumn name
    let choiceColumn = timeline.find(choiceColumn => {return choiceColumn.id == selectedTile.parentID;});

    document.getElementById("updateColumnNameInput").value = choiceColumn.name;
    $("#updateColumnName").show();    
}
// Hide add media dialogue
function hideUpdateColumnName() {
    $("#updateColumnName").hide();    
}
// Update tile name    
function updateColumnName() {
    // Getting choiceColumn
    let choiceColumn = timeline.find(choiceColumn => {return choiceColumn.id == selectedTile.parentID;});    

    // Getting file name from input field
    let columnName = document.getElementById("updateColumnNameInput").value; 
    
    // Pushing new media object with file name to timeline                                
    choiceColumn.name = columnName;

    // Refreshing timeline
    drawTimeline(timeline);

    // Refreshing inspector
    showInspector(selectedTile);
}

// Showing add icon dialogue
function showAddIcon() {
    hideInspectorButtons();
    $("#addIcon").show();    
}

// Hiding add icon
function hideAddIcon() {
    $("#addIcon").hide();       
}

// Adding icon
function addIcon(){
    let iconPath = document.getElementById("updateIcon").value;

    // Updating icon path
    selectedTile.icon = iconPath;

    // Returning to normal dialogue
    hideAddIcon();

    // Refreshing timeline
    drawTimeline(timeline);

    // Refreshing inspector
    showInspector();
}


// MEDIA
// __________________________________________________
// Add media    
function addMedia() {
    // Getting file name from input field
    let fileName = document.getElementById("addMediaFileName").value; 
    
    // Pushing new media object with file name to timeline                                               
    selectedTile.media.push({id: ids++, fileName: fileName, conditions: []});

    // Hiding add media dialogue
    hideAddMedia();

    // Refreshing timeline
    drawTimeline(timeline);

    // Refreshing inspector
    hideInspectorButtons();
    showInspector(selectedTile);
}  

// Remove media associated with tile
function deleteMedia(mediaNode) {
    // Getting index of media with mediaNode.id
    let media = selectedTile.media.find(media => { return media.id == mediaNode.id;});
    let mediaIndex = selectedTile.media.indexOf(media);

    // Splicing out media item  with id from selectedTile global                  
    selectedTile.media.splice(mediaIndex, 1);
    
    // Refreshing timeline
    drawTimeline(timeline);

    // Refreshing inspector
    hideInspectorButtons();
    showInspector(selectedTile);

    // Hiding media editor
    hideConditionEditor();
}

// Show add media dialogue
function showAddMedia() {
    hideInspectorButtons();
    $("#addMedia").show();     
}

// Hide add media dialogue
function hideAddMedia() {
    $("#addMedia").hide();
}

// Select media
function selectMedia(mediaNode) {
    // Checking if media exists                                           
    let media = selectedTile.media.find(media => {return media.id == mediaNode.id});                
    if(typeof media === "undefined") { 
        selectedMedia = null; 
        return; 
    }
    
    // Saving selected media to selectedMedia global
    selectedMedia = media;                

    // Showing media editor
    showConditionEditor(selectedMedia);                                   
}     

// Showing media editor
function showConditionEditor(selectedMedia){
    // Saving selected media to local variable
    let media = selectedMedia; 

    // Filling out media editor
    // Media file name
    $("#conditionEditor").html("<span class='inspectorHeading'>" + media.fileName + "</span>");

    // Filling out conditions
    let mediaConditions = "";
    media.conditions.forEach(condition => {
        mediaConditions += "<div class='inspectorTile' id='" + media.conditions.indexOf(condition) + "'>";
        mediaConditions += "<div class='deleteInspectorTile' id='" + media.conditions.indexOf(condition) + "' onclick='deleteCondition(this)'></div>";
   
        // Opening condition span
        mediaConditions += "<span class='condition'>";
        
        // Getting name of tile from choice ID
        let tile = timeline.find(tile => {return tile.id == condition.choiceID});
        let choice = tile.choices.find(choice => {return choice.id == condition.value;});
        mediaConditions += tile.name + " | ";

        // Appending choice value
        mediaConditions += choice.name;  

        // Closing condition span
        mediaConditions += "</span>";
        mediaConditions += "</div>";
    });

    // Appending mediaConditions to mediaEditor DIV
    $("#conditionEditor").append(mediaConditions);

    // Hiding add media button and media options, showing add condition button
    hideInspectorButtons();
    let firstChoiceColumn = timeline.find(tile => { return tile.type == "choiceColumn"; });
    if (typeof firstChoiceColumn != "undefined") {$("#addConditionButton").show();}
    

    // Showing condition editor
    $("#conditionEditor").show();
    $("#conditionEditorClose").show();                
}

// Hiding media editor
function hideConditionEditor() {
    // Hiding media editor
    $("#conditionEditor").hide();
    $("#conditionEditorClose").hide();
    $("#addConditionButton").hide();    
    $("#addCondition").hide();

    // Showing inspector buttons
    showingInspectorButtons();
}

// Condition
// __________________________________________________
// Showing add condition dialogue
function showAddCondition() {
    // Getting list of available choices
    let selectOptionsHTML = "";
    timeline.forEach(tile => {
        if (tile.type == "choiceColumn") {
            selectOptionsHTML += "<option value=" + tile.id + ">" + tile.name + "</option>";
        }
    });
    $("#addConditionChoice").html(selectOptionsHTML);

    // Populating choiceChosen with first choiceColumn's choices
    let firstChoiceColumn = timeline.find(tile => { return tile.type == "choiceColumn"; });
    if (typeof firstChoiceColumn == "undefined") {}

    let selectOptionsChoicesHTML = "";
    firstChoiceColumn.choices.forEach(choice => {
        selectOptionsChoicesHTML += "<option value=" + choice.id + ">" + choice.name + "</option>";
    });

    $("#addConditionChoiceChosen").html(selectOptionsChoicesHTML);

    // Showing add conditions dialogue
    $("#addCondition").show();

    // Hiding add condition button
    $("#addConditionButton").hide();
}

// Hiding add condition
function hideAddCondition() {
    // hiding add conditions dialogue
    $("#addCondition").hide();

    // Showing add condition button
    $("#addConditionButton").show();
}

// Add a condition to tile's media
function addCondition() {                
    // Formating condition
    let choiceColumn = document.getElementById("addConditionChoice").value; 
    let choiceChosen = document.getElementById("addConditionChoiceChosen").value; 
    let condition = {choiceID: choiceColumn, value: choiceChosen };

    // Adding condition to selectedMedia
    console.log(selectedMedia.conditions);
    selectedMedia.conditions.push(condition);
    console.log(selectedMedia.conditions);

    // Hiding add media dialogue
    hideAddCondition();

    // Refreshing timeline
    drawTimeline(timeline);

    // Refreshing inspector
    showInspector(selectedTile);

    // Refreshing media
    showConditionEditor(selectedMedia);
}

function deleteCondition (conditionNode) {    
    // Splicing out media item  with id from selectedTile global                
    selectedMedia.conditions.splice(conditionNode.id, 1);
    
    // Refreshing timeline
    drawTimeline(timeline);

    // Refreshing inspector and media editor
    showInspector(selectedTile);
    showConditionEditor(selectedMedia);
}

function updateChoiceOptions() {
    // Getting choice column 
    let choiceColumnID = document.getElementById("addConditionChoice").value; 
    let choiceColumn = timeline.find(choiceColumn => {return choiceColumn.id == choiceColumnID;});
    
    console.log(choiceColumnID);
    // Creating select options
    let selectOptionsHTML = "";
    choiceColumn.choices.forEach(choice => {
        selectOptionsHTML += "<option value=" + choice.id + ">" + choice.name + "</option>"
    });

    $("#addConditionChoiceChosen").html(selectOptionsHTML);
}

// FILE
// __________________________________________________
// Download data to a file
function download(xml) {
    let filename = "timeline.xml";
    var file = new Blob([xml], {type: "text/plain"});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { 
        var a = document.createElement("a");
        var url = URL.createObjectURL(file);
        
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

// Create xml from html data fields
function createXML(){
    // Opening empty xml
    let xml = "<timeline>";

    timeline.forEach(tile => {
        xml += "<tile>"
        xml += "<id>"+ tile.id +"</id>";

        let type = tile.type; 

        switch(type) {
            case "static":
                xml += "<type>"+ tile.type +"</type>";
                xml += "<name>"+ tile.name +"</name>";
                xml += "<videos>";
                tile.media.forEach(media => {
                    xml += "<video>";
                    xml += "<id>"+ media.id +"</id>";
                    xml += "<path>" + media.fileName + "</path>";

                    media.conditions.forEach(condition => {
                        xml += "<condition>";
                        xml += "<choiceID>" + condition.choiceID + "</choiceID>";
                        xml += "<choiceChosen>" + condition.value + "</choiceChosen>";
                        xml += "</condition>";
                    });

                    xml += "</video>";
                });
                xml += "</videos>";
                break;

            case "choiceColumn":
                xml += "<type>choice</type>";
                xml += "<name>"+ tile.name +"</name>";

                xml += "<choices>";
                tile.choices.forEach(choice => {
                    xml += "<choice>";
                    xml += "<name>"+ choice.name +"</name>";
                    xml += "<iconPath>"+ choice.icon +"</iconPath>";
                    xml += "<choiceID>"+ choice.parentID +"</choiceID>";
                    xml += "<choiceChosen>"+ choice.id +"</choiceChosen>";

                    xml += "<videos>";
                    choice.media.forEach(media => {
                        xml += "<video>";
                        xml += "<id>"+ media.id +"</id>";
                        xml += "<path>"+ media.fileName +"</path>";                        
                        media.conditions.forEach(condition => {
                            xml += "<condition>";
                            xml += "<choiceID>"+ condition.choiceID +"</choiceID>";
                            xml += "<choiceChosen>"+ condition.value +"</choiceChosen>";                        
                            xml += "</condition>";
                        });
                        xml += "</video>";
                    });
                    xml += "</videos>";

                    

                    xml += "</choice>";
                });

                xml += "</choices>";

                break;
        }

        xml += "</tile>"
    });
    xml += "</timeline>"

    download(xml);
}

// create js timeline from xml
function loadTimelineFromXML(xml) {
    timeline = new Array();
    
    // Stores xml objects
    var xmlArray = xml.getElementsByTagName("tile");    

    // Stores higest id
    let latestId = 0; 

    for (var i = 0; i <= xmlArray.length - 1; i++) {
        // Get tile type
        let id = xmlArray[i].getElementsByTagName("id")[0].childNodes[0].nodeValue;
        let type = xmlArray[i].getElementsByTagName("type")[0].childNodes[0].nodeValue;
        let name = xmlArray[i].getElementsByTagName("name")[0].childNodes[0].nodeValue;

        // Checking if id is greater than latestId
        if(parseInt(id) > latestId) { latestId = parseInt(id); }

        let tile; 

        if (type == "static") {
            tile = {
                id: id,
                type: type,
                name: name,
                media: new Array()
            };

            let videos = xmlArray[i].getElementsByTagName("videos")[0].children;
            for (let j = 0; j < videos.length; j++) {

                let id = videos[j].getElementsByTagName("id")[0].childNodes[0].nodeValue;

                // Checking if id is greater than latestId
                if(parseInt(id) > latestId) { latestId = parseInt(id); }
                console.log(id);

                let fileName = videos[j].getElementsByTagName("path")[0].childNodes[0].nodeValue;

                let media = {
                    id: id,
                    fileName: fileName,
                    conditions: new Array()
                };
                
                let conditions = videos[j].getElementsByTagName("condition"); 

                for (let k = 0; k < conditions.length; k++) {
                    
                    let choiceID = conditions[k].getElementsByTagName("choiceID")[0].childNodes[0].nodeValue;
                    let value = conditions[k].getElementsByTagName("choiceChosen")[0].childNodes[0].nodeValue;

                    media.conditions.push({
                        choiceID: choiceID,
                        value: value
                    });
                }

                tile.media.push(media);
            }

            timeline.push(tile);
        }

        else if (type == "choice") {
            
            let choiceColumnID = xmlArray[i].getElementsByTagName("id")[0].childNodes[0].nodeValue;

            // Checking if id is greater than latestId
            if(parseInt(choiceColumnID) > latestId) { latestId = parseInt(choiceColumnID); }
            console.log(choiceColumnID);

            tile = {
                id: id,
                type: "choiceColumn",
                name: name,
                choices: new Array()
            };

            let choices = xmlArray[i].getElementsByTagName("choices")[0].children;
            for (let j = 0; j < choices.length; j++) {

                let choiceID = choices[j].getElementsByTagName("choiceChosen")[0].childNodes[0].nodeValue; 
                console.log(choiceID)


                // Checking if id is greater than latestId
                if(parseInt(choiceID) > latestId) { latestId = parseInt(choiceID); }
                console.log(choiceID);

                let name = choices[j].getElementsByTagName("name")[0].childNodes[0].nodeValue;  
                let iconPath = choices[j].getElementsByTagName("iconPath")[0].childNodes[0].nodeValue;                

                let choice = {
                    id: choiceID,
                    parentID: choiceColumnID,
                    name: name,
                    type: "choice",
                    icon: iconPath,
                    media: new Array()
                };
                
                let videos = choices[j].getElementsByTagName("videos")[0].children;
                for (let k = 0; k < videos.length; k++) {
                    
                    let id = videos[k].getElementsByTagName("id")[0].childNodes[0].nodeValue;
                    let fileName = videos[k].getElementsByTagName("path")[0].childNodes[0].nodeValue;

                    // Checking if id is greater than latestId
                    if(parseInt(id) > latestId) { latestId = parseInt(id); }
                    console.log(id);

                    let media = {
                        id: id,
                        fileName: fileName,
                        conditions: new Array()
                    }; 

                    let conditions = videos[k].getElementsByTagName("condition"); 

                    for (let l = 0; l < conditions.length; l++) {
                        
                        let choiceID = conditions[l].getElementsByTagName("choiceID")[0].childNodes[0].nodeValue;
                        let value = conditions[l].getElementsByTagName("choiceChosen")[0].childNodes[0].nodeValue;

                        media.conditions.push({
                            choiceID: choiceID,
                            value: value
                        });
                    }

                    choice.media.push(media);
                }

                tile.choices.push(choice);
            }
            timeline.push(tile);

            // Refreshing global id to create more unique ids
            ids = latestId++;
            console.log(ids);
        }
    }
    
    console.log(timeline);
    drawTimeline(timeline);
}

function showHelp() {
    $("#help").fadeIn(100);
}

function hideHelp() {
    $("#help").fadeOut(100);   
}

// {
        //     id: 1,
        //     type: "choiceColumn",
        //     name: "Second Tile",
        //     choices: new Array(
        //         {
        //             id: 0,
        //             parentID: 1,
        //             name: "Choice 1",
        //             type: "choice",
        //             mediaType: "image",
        //             icon: "icon.png",
        //             media: new Array(
        //                 {id: 0, fileName: "sample1.mov", conditions: [{choiceID: 1, value: 0}, {choiceID: 1, value: 0}]},
        //                 {id: 1, fileName: "sample2.mov", conditions: [{choiceID: 1, value: 0}]}
        //             )
        //         }                
        //     )
        // },
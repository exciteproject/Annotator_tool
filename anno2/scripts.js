
var textFromFileLoaded = "";
var textByLines = "";
var currentLine = 0;

//load File //////////////////////////////////////////
function checkfileType(sender) {
	$('#dvLoading').show();
    var validExts = new Array(".txt", ".xml");
    var fileExt = sender.value;
    fileExt = fileExt.substring(fileExt.lastIndexOf('.'));
	
    if (validExts.indexOf(fileExt) < 0) {
      alert("Invalid file selected, valid files are of " + validExts.toString() + " types.");
      return false;
    }
    else
	{	
		emptyParameters(); 
		showfileName(); 		
		loadFileAsText();
	}
	$('#dvLoading').hide();
	return true;
}

function emptyParameters()
{
	textFromFileLoaded = "";
	textByLines = "";
	currentLine = 0;
	document.getElementById("txaxml").value = "";
	document.getElementById("content1").innerHTML = "";
	document.getElementById("demo").innerHTML = "";
}

function showfileName()
{
	//displays the filename of anything uploaded through button "uploadbtn" in label "demo". happens onchange of "uploadbtn"
	var x = document.getElementById("uploadbtn");
	var txt = "";
	if ('files' in x) 
	{
		for (var i = 0; i < x.files.length; i++) //made for any amount of uploaded files 
		{  
			var file = x.files[i];
			if ('name' in file) txt += "File Name : " + file.name;
		}
	}	
	else 
	{
		if (x.value == "")  txt += "Select one or more files.";
		else {
			txt += "The files property is not supported by your browser!";
			txt  += "<br>The path of the selected file: " + x.value; // If the browser does not support the files property, it will return the path of the selected file instead. 
		}
	}
	document.getElementById("demo").innerHTML = txt;
}

function loadFileAsText()
{
	//loads the file uploaded through "uploadbtn" into the textareas "content1" and "txaxml" and updates the "count" label. happens onchange of uploadbtn
	var fileToLoad = document.getElementById("uploadbtn").files[0];
	
	var fileReader = new FileReader();
	fileReader.onload = function(fileLoadedEvent)
	{
		textFromFileLoaded = fileLoadedEvent.target.result;
		textByLines = textFromFileLoaded.split('\n');//converts textfile into array of lines cutting whenever "\n" is in the file
		document.getElementById("content1").innerHTML = textByLines[0];
		document.getElementById("txaxml").value = textByLines[0];
		document.getElementById("count").innerHTML = 1 + "/" + textByLines.length ;
		colorize();
		
	};			
	fileReader.readAsText(fileToLoad, "UTF-8");
}

//save file//////////////////////////////////////////
function saveTextAsFile()
{
	if (document.getElementById("txaxml").value != "")
	{
		textByLines[currentLine] = document.getElementById("txaxml").value;
	
		textFromFileLoaded = textByLines.join("\n");
		document.getElementById("txaxml").value = textByLines[currentLine];	
	
		var textToWrite = textFromFileLoaded;
		var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
		//get file name
		var fullPath = document.getElementById('uploadbtn').value;
		if (fullPath) {
			var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
			var filename = fullPath.substring(startIndex);
			if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
				filename = filename.substring(1).split('.')[0];
			}
		}
		var fileNameToSaveAs = filename + ".xml";
		
		download(textToWrite, fileNameToSaveAs);
	}else
	alert('No File Selected');
}

function download(data, filename) {
    var file = new Blob([data], {type:'text/xml'});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
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

//Navigate between Lines/////////////////////////////////////

function gotoprevLine()
{
	//Saves the current txaxml content into textFromFileLoaded. Cycles backwards through the lines of an uploaded file updating label "count" and "content1"+"txaxml".happens onclick of "prev"
	textByLines[currentLine] = document.getElementById("txaxml").value;
	textFromFileLoaded = textByLines.toString();
	
	
	if(currentLine > 0)	currentLine = currentLine -1;
	else currentLine = textByLines.length-1;
	
	document.getElementById("content1").innerHTML = textByLines[currentLine];
	document.getElementById("txaxml").value = textByLines[currentLine];
	var line = currentLine+1
	document.getElementById("count").innerHTML = line + "/" + textByLines.length;
	colorize();
	//document.getElementById("tatest").value = textFromFileLoaded;
}

function gotonextLine()
{
	//Saves the current txaxml content into textFromFileLoaded. Cycles forwards through the lines of an uploaded file updating label "count" and "content1"+"txaxml". happens onclick of "next"
	textByLines[currentLine] = document.getElementById("txaxml").value;
	textFromFileLoaded = textByLines.toString();
	
	if(textByLines.length-1 > currentLine) 
		currentLine = currentLine +1;	
	else
		currentLine = 0;
	document.getElementById("content1").innerHTML = textByLines[currentLine];
	document.getElementById("txaxml").value = textByLines[currentLine];
	var line = currentLine+1;
	document.getElementById("count").innerHTML = line + "/" + textByLines.length;
	colorize();
	
	//document.getElementById("tatest").value = textFromFileLoaded;
}

//change color in plain text and translate to tags in textarea////////
function changeColor2(sender) 
{
    // Get Selection
	var text1 = document.getElementById("content1").innerHTML;
	if (document.getElementById("content1").innerHTML == "")
	{ 
		alert('Please Select a file');
		return;
	}
	var tagname = sender.value;
	//alert(tagname);
    
	sel = window.getSelection();
	var selectedtext = sel.toString();	
	var text11 = text1.substr(0, text1.indexOf(sel)) ;	
	
    if (sel.rangeCount && sel.getRangeAt) {
        range = sel.getRangeAt(0);
    }
    // Set design mode to on
    document.designMode = "on";
    if (range) {
        sel.removeAllRanges();
        sel.addRange(range);
    }
	
    //Colorize text	
	if( tagname =="au"){
		document.execCommand("HiliteColor", false, "#ff9681");
	}
	else if(tagname =="btnsurname"){
		text11 = text11 + '<span style="background-color: rgb(255, 206, 48);">';
		var secondplace = text1.indexOf(sel)+ selectedtext.length;
		var text12 = text1.substr(secondplace, text1.length);
		text12 = '</span>' + text12;
		document.getElementById("content1").innerHTML = text11 + selectedtext + text12;
		//document.execCommand("HiliteColor", false, "#ffce30");
	}
	else if(tagname == "btnfirstname"){
		text11 = text11 + '<span style="background-color: rgb(170, 187, 48);">';
		var secondplace = text1.indexOf(sel)+ selectedtext.length;
		var text12 = text1.substr(secondplace, text1.length);
		text12 = '</span>' + text12;
		document.getElementById("content1").innerHTML = text11 + selectedtext + text12;
		//document.execCommand("HiliteColor", false, "#aabb30");
	}
	else if(tagname =="ye"){
		document.execCommand("HiliteColor", false, "#bfb1d5");		
	}
	else if(tagname =="ti"){
		document.execCommand("HiliteColor", false, "#adddcf");
	}
	else if(tagname =="co"){
		document.execCommand("HiliteColor", false, "#abe1fd");
	}
	else if(tagname =="ed"){
		document.execCommand("HiliteColor", false, "#fed88f");
	}
	else if(tagname =="ot"){
		document.execCommand("HiliteColor", false, "#f4858e");
	}
	else{
		document.getElementById("error").innerHTML = " RadioButton broken!";		
	}
    // Set design mode to off
    document.designMode = "off";
	translateColor(sender);
}

function translateColor(sender)
{
	// replaces the manually added tags with colortags for content1. 
	//updateText();
	var textCopy =[];
	textCopy[currentLine] = document.getElementById("content1").innerHTML;
	var tagname = sender.value;
	
	var flagsurname = false;
	var flagfirstname = false;
	var openSpanValue = "";
		
	openSpanValue = '<span style="background-color: rgb(255, 206, 48);">';	
	while(textCopy[currentLine].indexOf(openSpanValue) !==-1)
	{
		flagsurname = true;
		var text1 = textCopy[currentLine].substr(0, textCopy[currentLine].indexOf(openSpanValue));
		var text2 = textCopy[currentLine].substr(textCopy[currentLine].indexOf(openSpanValue), textCopy[currentLine].length).replace("</span>", "</surname>");
		textCopy[currentLine] = text1 + text2;
		textCopy[currentLine] = textCopy[currentLine].replace(openSpanValue, '<surname>');
	}
	
	openSpanValue = '<span style="background-color: rgb(170, 187, 48);">';	
	while(textCopy[currentLine].indexOf(openSpanValue) !==-1)
	{
		flagfirstname = true;
		var text1 = textCopy[currentLine].substr(0, textCopy[currentLine].indexOf(openSpanValue));
		var text2 = textCopy[currentLine].substr(textCopy[currentLine].indexOf(openSpanValue), textCopy[currentLine].length).replace("</span>", "</firstname>");
		textCopy[currentLine] = text1 + text2;
		textCopy[currentLine] = textCopy[currentLine].replace(openSpanValue, '<firstname>');
	}

	openSpanValue = '<span style="background-color: rgb(255, 150, 129);">';	
	while(textCopy[currentLine].indexOf(openSpanValue) !==-1)
	{				
		var text1 = textCopy[currentLine].substr(0, textCopy[currentLine].indexOf(openSpanValue));
		var text2 = textCopy[currentLine].substr(textCopy[currentLine].indexOf(openSpanValue), textCopy[currentLine].length).replace("</span>", "</author>");
		textCopy[currentLine] = text1 + text2;
		textCopy[currentLine] = textCopy[currentLine].replace(openSpanValue, '<author>');	
	}	
	
	openSpanValue = '<span style="background-color: rgb(191, 177, 213);">';
	while (textCopy[currentLine].indexOf(openSpanValue) !==-1)
	{
		var t1 = textCopy[currentLine].substr(0, textCopy[currentLine].indexOf(openSpanValue));
		var t2 = textCopy[currentLine].substr(textCopy[currentLine].indexOf(openSpanValue), textCopy[currentLine].length).replace("</span>", "</year>")
		textCopy[currentLine] = t1 + t2;
		textCopy[currentLine] = textCopy[currentLine].replace('<span style="background-color: rgb(191, 177, 213);">', '<year>');
	}
	while (textCopy[currentLine].indexOf('<span style="background-color: rgb(173, 221, 207);">') !==-1)
	{
		textCopy[currentLine] = textCopy[currentLine].substr(0, textCopy[currentLine].indexOf('<span style="background-color: rgb(173, 221, 207);">')) + textCopy[currentLine].substr(textCopy[currentLine].indexOf('<span style="background-color: rgb(173, 221, 207);">'), textCopy[currentLine].length).replace("</span>", "</title>");
		textCopy[currentLine] = textCopy[currentLine].replace('<span style="background-color: rgb(173, 221, 207);">', '<title>');
	}
	while (textCopy[currentLine].indexOf('<span style="background-color: rgb(171, 225, 253);">') !==-1)
	{
		textCopy[currentLine] = textCopy[currentLine].substr(0, textCopy[currentLine].indexOf('<span style="background-color: rgb(171, 225, 253);">')) + textCopy[currentLine].substr(textCopy[currentLine].indexOf('<span style="background-color: rgb(171, 225, 253);">'), textCopy[currentLine].length).replace("</span>", "</container>");
		textCopy[currentLine] = textCopy[currentLine].replace('<span style="background-color: rgb(171, 225, 253);">', '<container>');
	}
	while (textCopy[currentLine].indexOf('<span style="background-color: rgb(254, 216, 143);">') !==-1)
	{
		textCopy[currentLine] = textCopy[currentLine].substr(0, textCopy[currentLine].indexOf('<span style="background-color: rgb(254, 216, 143);">')) + textCopy[currentLine].substr(textCopy[currentLine].indexOf('<span style="background-color: rgb(254, 216, 143);">'), textCopy[currentLine].length).replace("</span>", "</editor>");
		textCopy[currentLine] = textCopy[currentLine].replace('<span style="background-color: rgb(254, 216, 143);">', '<editor>');
	}
	while (textCopy[currentLine].indexOf('<span style="background-color: rgb(244, 133, 142);">') !==-1)
	{
		textCopy[currentLine] = textCopy[currentLine].substr(0, textCopy[currentLine].indexOf('<span style="background-color: rgb(244, 133, 142);">')) + textCopy[currentLine].substr(textCopy[currentLine].indexOf('<span style="background-color: rgb(244, 133, 142);">'), textCopy[currentLine].length).replace("</span>", "</other>");
		textCopy[currentLine] = textCopy[currentLine].replace('<span style="background-color: rgb(244, 133, 142);">', '<other>');
	}
	textByLines[currentLine] = textCopy[currentLine];
	document.getElementById("txaxml").value = textByLines[currentLine];
	textFromFileLoaded = textByLines.join("");
}

function colorize()
{// replaces the manually added tags with colortags for content1.
	textByLines[currentLine] = document.getElementById("txaxml").value;
	textFromFileLoaded = textByLines.join("");
	var textCopy = textByLines;
	
	while (textCopy[currentLine].indexOf("<author>") !==-1)
	{
		textCopy[currentLine] = textCopy[currentLine].replace("</author>", "</span>");
		textCopy[currentLine] = textCopy[currentLine].replace('<author>', '<span style="background-color: rgb(255, 150, 129);">');
	}
	while (textCopy[currentLine].indexOf("<surname>") !==-1)
	{
		textCopy[currentLine] = textCopy[currentLine].replace("</surname>", "</span>");
		textCopy[currentLine] = textCopy[currentLine].replace('<surname>', '<span style="background-color: rgb(255, 206, 48);">');
	}
	while (textCopy[currentLine].indexOf("<firstname>") !==-1)
	{
		textCopy[currentLine] = textCopy[currentLine].replace("</firstname>", "</span>");
		textCopy[currentLine] = textCopy[currentLine].replace('<firstname>', '<span style="background-color: rgb(170, 187, 48);">');
	}
	while (textCopy[currentLine].indexOf("<year>") !==-1)
	{
		textCopy[currentLine] = textCopy[currentLine].replace("</year>", "</span>");
		textCopy[currentLine] = textCopy[currentLine].replace('<year>', '<span style="background-color: rgb(191, 177, 213);">');
	}
	while (textCopy[currentLine].indexOf("<title>") !==-1)
	{
		textCopy[currentLine] = textCopy[currentLine].replace("</title>", "</span>");
		textCopy[currentLine] = textCopy[currentLine].replace('<title>', '<span style="background-color: rgb(173, 221, 207);">');
	}
	while (textCopy[currentLine].indexOf("<container>") !==-1)
	{
		textCopy[currentLine] = textCopy[currentLine].replace("</container>", "</span>");
		textCopy[currentLine] = textCopy[currentLine].replace('<container>', '<span style="background-color: rgb(171, 225, 253);">');
	}
	while (textCopy[currentLine].indexOf("<editor>") !==-1)
	{
		textCopy[currentLine] = textCopy[currentLine].replace("</editor>", "</span>");
		textCopy[currentLine] = textCopy[currentLine].replace('<editor>', '<span style="background-color: rgb(254, 216, 143);">');
	}
	while (textCopy[currentLine].indexOf("<other>") !==-1)
	{
		textCopy[currentLine] = textCopy[currentLine].replace("</other>", "</span>");
		textCopy[currentLine] = textCopy[currentLine].replace('<other>', '<span style="background-color: rgb(244, 133, 142);">');
	}
	document.getElementById("content1").innerHTML = textCopy[currentLine];
	
}

//Deleting Tags/////////////////////////////////////////////////////////////////////////////////////////
var textarea1 = "";
function preventDeleteChar(event)
{
	//alert("hiiiiii");
	
	//var textarea1 = document.getElementById("txaxml").value;
	//var flag = deletechar(event);
	//if (flag == false)
	//{
	//	document.getElementById("txaxml").value = textarea1;
	//	textarea1 = "";
	//}
	//alert(textarea1);
	
	event.preventDefault()
	//if (event.which==8 || event.which==46) 
	//{	
		//}
		//else
		//{
			//alert(event.which);
			//event.preventDefault()
		//}
}

function getBrowserInfo()
{
	var nVer = navigator.appVersion;
	var nAgt = navigator.userAgent;
	var browserName  = navigator.appName;
	var fullVersion  = ''+parseFloat(navigator.appVersion); 
	var majorVersion = parseInt(navigator.appVersion,10);
	var nameOffset,verOffset,ix;
	
	// In Opera, the true version is after "Opera" or after "Version"
	if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
	 browserName = "Opera";
	 fullVersion = nAgt.substring(verOffset+6);
	 if ((verOffset=nAgt.indexOf("Version"))!=-1) 
	   fullVersion = nAgt.substring(verOffset+8);
	}
	// In MSIE, the true version is after "MSIE" in userAgent
	else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
	 browserName = "Microsoft Internet Explorer";
	 fullVersion = nAgt.substring(verOffset+5);
	}
	// In Chrome, the true version is after "Chrome" 
	else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
	 browserName = "Chrome";
	 fullVersion = nAgt.substring(verOffset+7);
	}
	// In Safari, the true version is after "Safari" or after "Version" 
	else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
	 browserName = "Safari";
	 fullVersion = nAgt.substring(verOffset+7);
	 if ((verOffset=nAgt.indexOf("Version"))!=-1) 
	   fullVersion = nAgt.substring(verOffset+8);
	}
	// In Firefox, the true version is after "Firefox" 
	else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
	 browserName = "Firefox";
	 fullVersion = nAgt.substring(verOffset+8);
	}
	// In most other browsers, "name/version" is at the end of userAgent 
	else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) < 
			  (verOffset=nAgt.lastIndexOf('/')) ) 
	{
	 browserName = nAgt.substring(nameOffset,verOffset);
	 fullVersion = nAgt.substring(verOffset+1);
	 if (browserName.toLowerCase()==browserName.toUpperCase()) {
	  browserName = navigator.appName;
	 }
	}
	// trim the fullVersion string at semicolon/space if present
	if ((ix=fullVersion.indexOf(";"))!=-1)
	   fullVersion=fullVersion.substring(0,ix);
	if ((ix=fullVersion.indexOf(" "))!=-1)
	   fullVersion=fullVersion.substring(0,ix);

	majorVersion = parseInt(''+fullVersion,10);
	if (isNaN(majorVersion)) {
	 fullVersion  = ''+parseFloat(navigator.appVersion); 
	 majorVersion = parseInt(navigator.appVersion,10);
	}
	return browserName;
	//document.write(''
	 //+'Browser name  = '+browserName+'<br>'
	 //+'Full version  = '+fullVersion+'<br>'
	 //+'Major version = '+majorVersion+'<br>'
	 //+'navigator.appName = '+navigator.appName+'<br>'
	 //+'navigator.userAgent = '+navigator.userAgent+'<br>');
	
}

function RemoveTag(sender)
{
	sel = window.getSelection();
	if (sel == "")
	{
		alert('No Selection');
		return;
	}
	//alert(sel.anchorNode.parentElement.toString());
	if (sel.anchorNode.parentElement.toString()== "[object HTMLSpanElement]")
	{
		//alert('yes');
		$(sel.anchorNode.parentElement).contents().unwrap();
		translateColor(sender);
	}
	//alert(sel);
}
function RemoveTagold(sender)
{
	sel = window.getSelection();
	//var selectedTag = getSelectionParentElement().toString();
	//var selectedTagLen = selectedTag.length;
	//getSelectionParentElement().removeChild();
	
	//sel.anchorNode.parentElement.remove();
	//$(sel).css({"color": "red", "border": "2px solid red"});
	//alert();
	//$(sel).remove();
	//alert(.parent());

	var selectedtext = sel.toString();	
	var parentTag = $("#delbtn").parent();
	//alert(parentTag);
	
    if (sel.rangeCount && sel.getRangeAt) {
        range = sel.getRangeAt(0);
    }
    // Set design mode to on
    document.designMode = "on";
    if (range) {
        sel.removeAllRanges();
        sel.addRange(range);
    }
	if (getBrowserInfo() == "Chrome")
	{
		document.execCommand("removeFormat", false, "foreColor");
	}
		
	else if (getBrowserInfo() == "Firefox")
	{
		document.execCommand("removeFormat",false,"foreColor");
		
	}
	document.designMode = "off";
	translateColor(sender);	
}

function getSelectionParentElement() {
    var parentEl = null, sel;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.rangeCount) {
            parentEl = sel.getRangeAt(0).commonAncestorContainer;
            if (parentEl.nodeType != 1) {
                parentEl = parentEl.parentNode;
            }
        }
    } else if ( (sel = document.selection) && sel.type != "Control") {
        parentEl = sel.createRange().parentElement();
    }
	//alert(arentEl);
    return parentEl.outerHTML;
}

function deletechar(event)
{
	//alert(textarea1);
	var x = event.which || event.keyCode;
	
	var flag = false;
	if (x==8 || x==46 ) 
	{
		var openTag = "<author>";
		var closeTag = "</author>";
		var closeTag2 = "/author>";
		var openTagRegExp = new RegExp('<author(?!>)|(author>)|<autho>|<authr>|<autor>|<auhor>|<athor>|<uthor>'); //
		var closeTagRegExp = new RegExp('<\/author(?!>)|<\/autho>|<\/authr>|<\/autor>|<\/auhor>|<\/athor>|<\/uthor>');//|(?!<)/author>
		deleteTagsfun(openTag, closeTag, closeTag2, openTagRegExp, closeTagRegExp);
		if (deleteTagsfun(openTag, closeTag, closeTag2, openTagRegExp, closeTagRegExp))
			flag= true;
		
		openTag = "<year>";
		closeTag = "</year>";
		closeTag2 = "/year>";
		openTagRegExp = new RegExp('<year(?!>)|(year>)|<yea>|<yer>|<yar>|<ear>'); //|(?!<)year>
		closeTagRegExp = new RegExp('<\/year(?!>)|<\/yea>|<\/yer>|<\/yar>|<\/ear>');//|(?!<)/year>
		deleteTagsfun(openTag, closeTag, closeTag2, openTagRegExp, closeTagRegExp);
		if (deleteTagsfun(openTag, closeTag, closeTag2, openTagRegExp, closeTagRegExp))
			flag= true;
		
		openTag = "<title>";
		closeTag = "</title>";
		closeTag2 = "/title>";
		openTagRegExp = new RegExp('<title(?!>)|(title>)|<titl>|<tite>|<tile>|<ttle>|<itle>'); //|(?!<)title>
		closeTagRegExp = new RegExp('<\/title(?!>)|<\/titl>|<\/tite>|<\/tile>|<\/ttle>|<\/itle>');//|(?!<)/title>
		deleteTagsfun(openTag, closeTag, closeTag2, openTagRegExp, closeTagRegExp);
		if (deleteTagsfun(openTag, closeTag, closeTag2, openTagRegExp, closeTagRegExp))
			flag= true;
		
		openTag = "<container>";
		closeTag = "</container>";
		closeTag2 = "/container>";
		openTagRegExp = new RegExp('<container(?!>)|(container>)|<containe>|<containr>|<contaier>|<contaner>|<continer>|<conainer>|<cotainer>|<cntainer>|<ontainer>'); //|(?!<)container>;
		closeTagRegExp = new RegExp('<\/container(?!>)|<\/containe>|<\/containr>|<\/contaier>|<\/contaner>|<\/continer>|<\/conainer>|<\/cotainer>|<\/cntainer>|<\/ontainer>');//|(?!<)/container>
		deleteTagsfun(openTag, closeTag, closeTag2, openTagRegExp, closeTagRegExp);
		if (deleteTagsfun(openTag, closeTag, closeTag2, openTagRegExp, closeTagRegExp))
			flag= true;
		
		openTag = "<editor>";
		closeTag = "</editor>";
		closeTag2 = "/editor>";
		openTagRegExp = new RegExp('<editor(?!>)|(editor>)|<edito>|<editr>|<edior>|<edtor>|<eitor>|<ditor>'); //|(?!<)editor>
		closeTagRegExp = new RegExp('<\/editor(?!>)|<\/edito>|<\/editr>|<\/edior>|<\/edtor>|<\/eitor>|<\/ditor>');//|(?!<)/editor>
		deleteTagsfun(openTag, closeTag, closeTag2, openTagRegExp, closeTagRegExp);
		if (deleteTagsfun(openTag, closeTag, closeTag2, openTagRegExp, closeTagRegExp))
			flag= true;
		
		openTag = "<other>";
		closeTag = "</other>";
		closeTag2 = "/other>";
		openTagRegExp = new RegExp('<other(?!>)|(other>)|<othe>|<othr>|<oter>|<oher>|<ther>');//|(?!<)other>
		closeTagRegExp = new RegExp('<\/other(?!>)|<\/othe>|<\/othr>|<\/oter>|<\/oher>|<\/ther>');//|(?!<)/other>
		deleteTagsfun(openTag, closeTag, closeTag2, openTagRegExp, closeTagRegExp);
		if (deleteTagsfun(openTag, closeTag, closeTag2, openTagRegExp, closeTagRegExp))
			flag= true;
	
		openTag = "<surname>";
		closeTag = "</surname>";
		closeTag2 = "/surname>";
		openTagRegExp = new RegExp('<surname(?!>)|(surname>)|<surnam>|<surnae>|<surnme>|<surame>|<suname>|<srname>|<urname>');
		closeTagRegExp = new RegExp('<\/surname(?!>)|<\/surnam>|<\/surnae>|<\/surnme>|<\/surame>|<\/suname>|<\/srname>|<\/urname>');
		deleteTagsfun(openTag, closeTag, closeTag2, openTagRegExp, closeTagRegExp);
		if (deleteTagsfun(openTag, closeTag, closeTag2, openTagRegExp, closeTagRegExp))
			flag= true;
	
		openTag = "<firstname>";
		closeTag = "</firstname>";
		closeTag2 = "/firstname>";
		openTagRegExp = new RegExp('<firstname(?!>)|(firstname>)|<firstnam>|<firstnae>|<firstnme>|<firstame>|<firsname>|<firtname>|<fistname>|<frstname>|<irstname>');
		closeTagRegExp = new RegExp('<\/firstname(?!>)|<\/firstnam>|<\/firstnae>|<\/firstnme>|<\/firstame>|<\/firsname>|<\/firtname>|<\/fistname>|<\/frstname>|<\/irstname>');
		deleteTagsfun(openTag, closeTag, closeTag2, openTagRegExp, closeTagRegExp);
		if (deleteTagsfun(openTag, closeTag, closeTag2, openTagRegExp, closeTagRegExp))
			flag= true;
		
		colorize();
	}else	
	{
		flag= false;
		//else if ( x!= 37 && x!= 38 && x!= 39 && x != 40) 
		//alert(x);
		//alert('Oppsss');
		//event.preventDefault();		
	}
	
	return flag;
}

function deleteTagsfun(openTag, closeTag,closeTag2, openTagRegExp, closeTagRegExp)
{ 
	var textCopy = [];
	textCopy[currentLine] = document.getElementById("txaxml").value;						
	var textCopylength = textCopy[currentLine].length;	
	
	var foundOpenTag = 0;
	for (var i = 0; i < textCopylength; i++) {
		var temp = textCopy[currentLine].substring(i, i+openTag.length);
		if (textCopy[currentLine].substring(i, i+openTag.length) == openTag) {
			foundOpenTag = foundOpenTag + 1;
		}
	}
	
	var foundCloseTag = 0;
	for (var i = 0; i < textCopylength; i++) {
		var temp = textCopy[currentLine].substring(i, i+closeTag);
		if (textCopy[currentLine].substring(i, i+closeTag.length) == closeTag) {
			foundCloseTag = foundCloseTag + 1;
		}
	}
	
	var foundCloseTag2 = 0;
	for (var i = 0; i < textCopylength; i++) {
		var temp = textCopy[currentLine].substring(i, i+closeTag2);
		if (textCopy[currentLine].substring(i, i+closeTag2.length) == closeTag2) {
			foundCloseTag2 = foundCloseTag2 + 1;
		}
	}
	//alert(foundOpenTag);
	
	if (foundOpenTag == foundCloseTag)
		return;
	if (textCopy[currentLine].search(openTagRegExp) !==-1 && foundOpenTag == 0 )
	{
		var OpenTagPosition = textCopy[currentLine].search(openTagRegExp);					
		var text1 = textCopy[currentLine].substr(0, OpenTagPosition);
		var text2 = textCopy[currentLine].substr( OpenTagPosition, textCopylength);
		textCopy[currentLine] = text1 + text2;
		textCopy[currentLine] = textCopy[currentLine].replace(closeTag, "")
		textCopy[currentLine] = textCopy[currentLine].replace(openTagRegExp, "");
		document.getElementById("txaxml").value = textCopy[currentLine];
		return true;
	}
		
	if(textCopy[currentLine].search(closeTagRegExp) !==-1 || foundOpenTag == 2 || foundCloseTag2 == 1)
	{	
		if (foundOpenTag == 2)
		{
			textCopy[currentLine] = textCopy[currentLine].replace(openTag, "");	
			textCopy[currentLine] = textCopy[currentLine].replace(openTag, "");
			textCopy[currentLine] = textCopy[currentLine].replace(closeTagRegExp, "");
			document.getElementById("txaxml").value = textCopy[currentLine];
			return true;			
		} else if( foundOpenTag ==1 && foundCloseTag ==0 && foundCloseTag2 == 1)
		{
			//ye Estesn baraye /author>  benevis http://www.regextester.com/
			var authorCloseTagPosition = textCopy[currentLine].search(closeTag2);
			var text1 = textCopy[currentLine].substr(0, authorCloseTagPosition);
			var text2 = textCopy[currentLine].substr(authorCloseTagPosition, textCopylength);
			textCopy[currentLine] = text1 + text2;
			
			textCopy[currentLine] = textCopy[currentLine].replace(openTag, "");
			textCopy[currentLine] = textCopy[currentLine].replace(closeTag2, "");
			document.getElementById("txaxml").value = textCopy[currentLine];
			return true;
		}else if(textCopy[currentLine].search(closeTagRegExp) !==-1 )
		{
			var authorCloseTagPosition = textCopy[currentLine].search(closeTagRegExp);
			var text1 = textCopy[currentLine].substr(0, authorCloseTagPosition);
			var text2 = textCopy[currentLine].substr(authorCloseTagPosition, textCopylength);
			textCopy[currentLine] = text1 + text2;
			
			textCopy[currentLine] = textCopy[currentLine].replace(openTag, "");
			textCopy[currentLine] = textCopy[currentLine].replace(closeTagRegExp, "");
			document.getElementById("txaxml").value = textCopy[currentLine];
			return true;
		}
		
	}
	return false;
}

//for undrestanding the deleteTags function 
function deleteTags2()
{ 
	var textCopy = [];
	textCopy[currentLine] = document.getElementById("txaxml").value;						
	var textCopylength = textCopy[currentLine].length;	
	var foundOpenTag = 0;
	for (var i = 0; i < textCopylength; i++) {
		var temp = textCopy[currentLine].substring(i, i+8);
		if (textCopy[currentLine].substring(i, i+8) === "<author>") {
			foundOpenTag = foundOpenTag + 1;
		}
	}
	//alert(foundOpenTag);
	
	var authorOpenTag = new RegExp('<author(?!>)|(author>)|<autho>|<authr>|<autor>|<auhor>|<athor>|<uthor>'); //
	if (textCopy[currentLine].search(authorOpenTag) !==-1 && foundOpenTag == 0 )
	{
		var authorOpenTagPosition = textCopy[currentLine].search(authorOpenTag);					
		var text1 = textCopy[currentLine].substr(0, authorOpenTagPosition);
		var text2 = textCopy[currentLine].substr(authorOpenTagPosition, textCopylength);
		textCopy[currentLine] = text1 + text2;
		textCopy[currentLine] = textCopy[currentLine].replace("</author>", "")
		textCopy[currentLine] = textCopy[currentLine].replace(authorOpenTag, "");
		document.getElementById("txaxml").value = textCopy[currentLine];
		return;
	}
	var authorCloseTag = new RegExp('<\/author(?!>)|(\/author>)|<\/autho>|<\/authr>|<\/autor>|<\/auhor>|<\/athor>|<\/uthor>');//|(?!<)/author>
	if(textCopy[currentLine].search(authorCloseTag) !==-1 || foundOpenTag == 2)
	{	
		if (foundOpenTag == 2)
		{
			textCopy[currentLine] = textCopy[currentLine].replace("<author>", "");						
		}else
		{
			var authorCloseTagPosition = textCopy[currentLine].search(authorCloseTag);
			var text1 = textCopy[currentLine].substr(0, authorCloseTagPosition);
			var text2 = textCopy[currentLine].substr(authorCloseTagPosition, textCopylength);
			textCopy[currentLine] = text1 + text2;
		}
		textCopy[currentLine] = textCopy[currentLine].replace("<author>", "");
		textCopy[currentLine] = textCopy[currentLine].replace(authorCloseTag, "");
		document.getElementById("txaxml").value = textCopy[currentLine];
		return;
	}
	
}




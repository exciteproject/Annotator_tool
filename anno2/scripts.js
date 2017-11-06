
var textFromFileLoaded = "";
var textByLines0 = "";
var textByLines = "";
var currentLine = 0;
var lastSessionFlag = false;
var filename = "";

function emptyParameters()
{
	textFromFileLoaded = "";
	textByLines = "";
    textByLines0 = "";
	currentLine = 0;
    filename = "";
	document.getElementById("txaxml").value = "";
    document.getElementById("contentForDemo").innerHTML = "";
	document.getElementById("content1").innerHTML = "";
	document.getElementById("demo").innerHTML = "";
}

$(document).ready(function(){

    $('#contentForDemo').attr('unselectable','on')
            .css({'-moz-user-select':'-moz-none',
            '-moz-user-select':'none',
            '-o-user-select':'none',
            '-khtml-user-select':'none', /* you could also put this in a class */
            '-webkit-user-select':'none',/* and add the CSS class here instead */
            '-ms-user-select':'none',
            'user-select':'none'
     }).bind('selectstart', function(){ return false; });
     
    //2
    $('#lblerror').attr('unselectable','on')
        .css({'-moz-user-select':'-moz-none',
        '-moz-user-select':'none',
        '-o-user-select':'none',
        '-khtml-user-select':'none', /* you could also put this in a class */
        '-webkit-user-select':'none',/* and add the CSS class here instead */
        '-ms-user-select':'none',
        'user-select':'none'
    }).bind('selectstart', function(){ return false; });
    
    ////load lasst saved localstorage
    $("#btnLoadSession").click(function(){        
        if(typeof(Storage)!=="undefined")
        {
            if (localStorage.getItem("anno2lastxmltext") != "")
            {
                //1
                var localStorage1 =  localStorage.getItem("anno2lastxmltext");
                var file = new Blob([localStorage1], {type:'text/xml'});
                var fileToLoad = file;
                document.getElementById("chbCermine").checked = false;
                //2
                if (localStorage.getItem("anno2lastoroginalreftext") != "")
                    lastSessionFlag = true;
                //3
                if (localStorage.getItem("anno2filename") != "")
                {
                    filename = localStorage.getItem("anno2filename");
                }
                loadFileAsText(fileToLoad);                
            }else
                alert("Sorry! No Data To Load..");
        }
        else
        {
            alert("Sorry! No Web Storage support..");
        }
    });
    
    ////reloade the page and save the changes
    $("#btnReload").click(function(){
        
        var textforSave = getxaxmlText();
        if (textforSave !="")
            localStorage.setItem("anno2lastxmltext", textforSave);
        //2
        var lastoroginalreftext = "";
        if (textByLines0 !="")
            lastoroginalreftext = textByLines0.join("\n");
        localStorage.setItem("anno2lastoroginalreftext", lastoroginalreftext);
        //3
        if (filename != "")
        {
            localStorage.setItem("anno2filename", filename);
        }   
        location.reload();        
    });
});

//saved the last changes before closeing
window.onbeforeunload = function()
{
    //1
    var textforSave = getxaxmlText();
    if (textforSave !="")
        localStorage.setItem("anno2lastxmltext", textforSave);  
    //2
    var lastoroginalreftext = "";
    if (textByLines0 != "")
    {
        lastoroginalreftext = textByLines0.join("\n");
        localStorage.setItem("anno2lastoroginalreftext", lastoroginalreftext);
    }  
    //3
    if (filename != "")
    {
        localStorage.setItem("anno2filename", filename);
    }    
}

//load File //////////////////////////////////////////
function checkfileType(sender) {
    //check text file type. only ".txt", ".xml" are valid
	$('#dvLoading').show();
    var validExts = new Array(".txt", ".xml");
    var fileExt = sender.value;
    fileExt = fileExt.substring(fileExt.lastIndexOf('.'));
	
    if (validExts.indexOf(fileExt) < 0) {
      alert("No File Selected. Invalid file selected!!");
      return false;
    }
    else
	{	
		emptyParameters(); 
		showfileName();        
        var fileToLoad = document.getElementById("uploadbtn").files[0];
        $("infoPanel").show();
        document.getElementById("demo").innerHTML = "("+ document.getElementById("demo").innerHTML + ") - ( File Size : "+ getFile_Size(document.getElementById("uploadbtn")) + ")";
		loadFileAsText(fileToLoad);
	}
	$('#dvLoading').hide();
	return true;
}

//displays the filename of in "uploadbtn" in label "demo".
function showfileName()
{
	
	var x = document.getElementById("uploadbtn");
	var txt = "";
	if ('files' in x) 
	{
		for (var i = 0; i < x.files.length; i++) //made for any amount of uploaded files 
		{  
			var file = x.files[i];
            filename = file.name.split('.')[0];
            //alert(filename);
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

// return file size
function getFile_Size(sender)
{    
    var _size = sender.files[0].size;
    var fSExt = new Array('Bytes', 'KB', 'MB', 'GB'),
    i=0;
    while(_size>900){_size/=1024;i++;}
    var exactSize = (Math.round(_size*100)/100)+' '+fSExt[i];
    return exactSize;
}

var annotatorresult = "";
function AjaxFailed(result){alert(result.status+''+result.statusText);}

function callAnnotatorWebService(a){
    $.ajax({
    type:"GET",
    async:false,
    url:"http://193.175.238.110:8080/maven-ws-rest-3/webapi/myresource/annotate2/"+a,
    contentType:"text/plain; charset=utf-8",
    dataType:"text",
    processData:true,
    success:function(result){annotatorresult = result;},
    eror:AjaxFailed});
}

function AnnotateText(textByLine, i)
{
    var LineText = textByLine;                
    var LengthOfLine = textByLine.length;
    var errorMsg = "";
    var QFlag = false;
    var SFlag = false;
    var LFlag = false;
    
    if (LengthOfLine > 0)
    {
        //Replace ? and ; then call webservice
        //Refrences with ? and ; have problem to annotate by webservice   
        while (textByLine.indexOf('?') !==-1)
        {
            QFlag = true;
            textByLine = textByLine.replace('?', 'QUESTIONMARKINTEXT');
        }     
        while (textByLine.indexOf(';') !==-1)
        {
            SFlag = true;
            textByLine = textByLine.replace(';', 'SEMICOLONINTEXT');
        }        
        while (textByLine.indexOf('/') !==-1)
        {
            LFlag = true;
            textByLine = textByLine.replace('/', 'SLASHINTEXT');
        }

        callAnnotatorWebService(textByLine);
        
        if (QFlag)
        {
            while (annotatorresult.indexOf('QUESTIONMARKINTEXT') !==-1)
            {
                annotatorresult = annotatorresult.replace('QUESTIONMARKINTEXT', '?');
            }
        }
        if (SFlag)
        {
            while (annotatorresult.indexOf('SEMICOLONINTEXT') !==-1)
            {
                annotatorresult = annotatorresult.replace('SEMICOLONINTEXT', ';');
            }
        }
        if (LFlag)
        {
            while (annotatorresult.indexOf('SLASHINTEXT') !==-1)
            {
                annotatorresult = annotatorresult.replace('SLASHINTEXT', '/');
            }
        }
            
        AnnotatedText = annotatorresult;
        LengthOfAnnotatedText = annotatorresult.length;
        textByLine = annotatorresult;                    
        if (LengthOfAnnotatedText == 0)
        {                        
            var l = i+1;
            document.getElementById("lblerror").style.color = "red";
            document.getElementById("lblerror").innerHTML += "Error in refnumber " + l + ": Not annotated. </br>";  
            textByLine = LineText;
        } else if (LengthOfLine > LengthOfAnnotatedText)
        {
            var l = i+1
            errorMsg = "Error in refnumber " + l;
            errorMsg += ": Not annotated currectly. -->(";
            errorMsg += LineText.substring(0, 20) + " ...)";
            errorMsg += "LenOfOriginalText: " + LengthOfLine + " And LenOfAnnoText: " + LengthOfAnnotatedText+ "</br>";
            document.getElementById("lblerror").style.color = "red";
            document.getElementById("lblerror").innerHTML += errorMsg;                        
        }
        annotatorresult = "";    
    }
    return textByLine;
}

function loadFileAsText(fileToLoad)
{
	// loads the file uploaded through "uploadbtn" into the "content1" and "txaxml"    
	var fileReader = new FileReader();
	fileReader.onload = function(fileLoadedEvent)
	{
		textFromFileLoaded = fileLoadedEvent.target.result;
        //converts textfile into array of lines cutting whenever "\n" is in the file
		textByLines = textFromFileLoaded.split('\n');
        if (lastSessionFlag == false)
        {            
            textByLines0 = textFromFileLoaded.split('\n');
            document.getElementById("demo").innerHTML = document.getElementById("demo").innerHTML + " - (References Number: " + textByLines.length + " )";
        }
        else
        {
            textByLines0 = localStorage.getItem("anno2lastoroginalreftext").split('\n');
            lastSessionFlag = false;
            document.getElementById("demo").innerHTML = " Loadeding Data From Last Session:(File Name: "+ filename +")-(References Number: " + textByLines.length + " )";            
        }
        if ($('#chbCermine').is(":checked"))
        {                 
            $("#spinner").show("slow", function(){           
                for (i=1; i< textByLines.length; i++)
                {                    
                    textByLines[i] = AnnotateText(textByLines[i], i);
                }            
                $("#spinner").hide("slow");
            });
            textByLines[0] = AnnotateText(textByLines[0], 0);
        }
        
        
		document.getElementById("content1").innerHTML = textByLines[0];
        document.getElementById("txaxml").value = textByLines[0];        
    
        //
        document.getElementById("contentForDemo").innerHTML = textByLines0[0];
        // and updates the "count" label.
		document.getElementById("count").innerHTML = 1 + "/" + textByLines.length ;
		colorize();
		
	};			
	fileReader.readAsText(fileToLoad, "UTF-8");
}

//save file/////////
function saveTextAsFile()
{
	if (document.getElementById("txaxml").value != "")
	{
        //1
		var textToWrite = getxaxmlText();
        //2
        var fileNameToSaveAs = getFileName();
        //3
		download(textToWrite, fileNameToSaveAs);
	}
    else
        alert('No File Selected OR Text is Empty ');
}

function getxaxmlText()
{
    //return text To Write
	if (document.getElementById("txaxml").value != "")
	{
		textByLines[currentLine] = document.getElementById("txaxml").value;
	
		textFromFileLoaded = textByLines.join("\n");
		document.getElementById("txaxml").value = textByLines[currentLine];	
	
		var textToWrite = textFromFileLoaded;
		return textToWrite;
	} else
    return "";
}

//get file name
function getFileName()
{   
    //alert(filename);
    var fileNameToSaveAs = filename + ".xml";
    //var fileNameToSaveAs = ""
    //var fullPath = document.getElementById('uploadbtn').value;
    //if (fullPath) {
    //    var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
    //    var filename2 = fullPath.substring(startIndex);
    //    if (filename2.indexOf('\\') === 0 || filename2.indexOf('/') === 0) {
    //        fileNameToSaveAs = filename2.substring(1).split('.')[0];
    //    }
    //}       
    //fileNameToSaveAs = fileNameToSaveAs + ".xml";
    return fileNameToSaveAs;
}

function download(data, filename1) {
    var file = new Blob([data], {type:'text/xml'});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename1);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename1;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

//Navigate between Lines/////////////////////////////////////
function gotoline()
{
    //Saves the current txaxml content into textFromFileLoaded. 
    //Cycles backwards through the lines of an uploaded file updating label "count" and "content1"+"txaxml".happens onclick of "prev"
	textByLines[currentLine] = document.getElementById("txaxml").value;
	textFromFileLoaded = textByLines.toString();	
	if(currentLine > 0)	currentLine = currentLine -1;
	else currentLine = textByLines.length-1;
    document.getElementById("content1").innerHTML = textByLines[currentLine];
    document.getElementById("contentForDemo").innerHTML = textByLines0[currentLine];
	document.getElementById("txaxml").value = textByLines[currentLine];
	var line = currentLine+1;
	document.getElementById("count").innerHTML = line + "/" + textByLines.length;
	colorize();
}

function gotofirstLine()
{
    currentLine = 1;	
    gotoline(currentLine);
}

function gotoprevLine()
{
    gotoline(currentLine);
}

function gotolastLine()
{
    currentLine = textByLines.length-1;
    document.getElementById("txaxml").value = textByLines[currentLine];
	textFromFileLoaded = textByLines.toString();	
    document.getElementById("content1").innerHTML = textByLines[currentLine];
    document.getElementById("contentForDemo").innerHTML = textByLines0[currentLine];
	document.getElementById("txaxml").value = textByLines[currentLine];
	var line = currentLine+1;
	document.getElementById("count").innerHTML = line + "/" + textByLines.length;
	colorize();
}

function gotonextLine()
{
	//Saves the current txaxml content into textFromFileLoaded. Cycles forwards through the lines of an uploaded file updating label "count" and "content1"+"txaxml". happens onclick of "next"
	textByLines[currentLine] = document.getElementById("txaxml").value;
	textFromFileLoaded = textByLines.toString();	
	if(textByLines.length-1 > currentLine) 
		currentLine = currentLine +1;	
	else currentLine = 0;
    document.getElementById("content1").innerHTML = textByLines[currentLine];
    document.getElementById("contentForDemo").innerHTML = textByLines0[currentLine];
	document.getElementById("txaxml").value = textByLines[currentLine];
	var line = currentLine+1;
	document.getElementById("count").innerHTML = line + "/" + textByLines.length;
	colorize();    
}

//change color in plain text then call other function to translate tags in textarea ////////
function ChangeColor_TranslateColor(sender) 
{
    // Get Selection
	var text1 = document.getElementById("content1").innerHTML;
    //alert(text1);
	if (document.getElementById("content1").innerHTML == "")
	{ 
		alert('Please Select a file');
		return;
	}
	var tagname = sender.value;    
	sel = window.getSelection();
	var selectedtext = sel.toString();	
    /* for test
    //alert(selectedtext);
    //alert(sel.anchorNode.parentElement.toString());
    
    var authorCloseTag = '<span style="background-color: rgb\(255, 150, 129\);">(.*?)\</span>';
    var textCopy =[];
	textCopy[currentLine] = document.getElementById("content1").innerHTML;
    //alert(textCopy[currentLine].search(authorCloseTag));
    if(textCopy[currentLine].search(authorCloseTag) != -1 )
        alert("finddddd");*/
        
    
    if (sel.anchorNode.parentElement.toString() != "[object HTMLSpanElement]")
	{
		if (tagname =="btnsurname" || tagname =="btngiven-names")
        {
            alert("Adding First Name and Surname only in Author and Editor tag is possible.");
            return;
        }
	}
	var text11 = text1.substr(0, text1.indexOf(sel)) ;	
	//alert(text11);
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
	if( tagname =="btnauthor"){
		document.execCommand("HiliteColor", false, "#ff9681");
	}
	else if(tagname =="btnsurname"){
		/*text11 = text11 + '<span style="background-color: rgb(255, 206, 48);">';
		var secondplace = text1.indexOf(sel)+ selectedtext.length;
		var text12 = text1.substr(secondplace, text1.length);
		text12 = '</span>' + text12;
        var aaaa = text11 + selectedtext + text12
		document.getElementById("content1").innerHTML = text11 + selectedtext + text12;*/
		document.execCommand("HiliteColor", false, "#ffce30");
	}
	else if(tagname == "btngiven-names"){
		/*text11 = text11 + '<span style="background-color: rgb(170, 187, 48);">';
		var secondplace = text1.indexOf(sel)+ selectedtext.length;
		var text12 = text1.substr(secondplace, text1.length);
		text12 = '</span>' + text12;
        var aaaa = text11 + selectedtext + text12
        document.getElementById("content1").innerHTML = text11 + selectedtext + text12;*/
		document.execCommand("HiliteColor", false, "#aabb30");
	}
	else if(tagname =="btnyear"){
		document.execCommand("HiliteColor", false, "#bfb1d5");		
	}
	else if(tagname =="btntitle"){
		document.execCommand("HiliteColor", false, "#adddcf");
	}
	else if(tagname =="btnsource"){
		document.execCommand("HiliteColor", false, "#abe1fd");
	}
	else if(tagname =="btneditor"){
		document.execCommand("HiliteColor", false, "#fed88f");
	}   
    else if(tagname =="btnvolume"){
		document.execCommand("HiliteColor", false, "#ffff66");
	}  
	else if(tagname =="btnother"){
		document.execCommand("HiliteColor", false, "#f4858e");
	}
    else if(tagname =="btnfpage"){
		document.execCommand("HiliteColor", false, "#ccff66");
	}
    else if(tagname =="btnlpage"){
		document.execCommand("HiliteColor", false, "#ffb3ff");
	}
	else{
		document.getElementById("error").innerHTML = " RadioButton broken!";		
	}
    // Set design mode to off
    document.designMode = "off";
    //2 surname
    //var textCopy =[];
	//textCopy[currentLine] = document.getElementById("content1").innerHTML;
    //while (textCopy[currentLine].indexOf('</span><span style="background-color: rgb(255, 206, 48);">') !==-1)
	//{
	//	textCopy[currentLine] = textCopy[currentLine].replace('</span><span style="background-color: rgb(255, 206, 48);">', '<span style="background-color: rgb(255, 206, 48);">');
	//}
    //2 given-names
    //while (textCopy[currentLine].indexOf('</span><span style="background-color: rgb(170, 187, 48);">') !==-1)
	//{
	//	textCopy[currentLine] = textCopy[currentLine].replace('</span><span style="background-color: rgb(170, 187, 48);">', '<span style="background-color: rgb(170, 187, 48);">');
	//}
	translateColor(sender);
}

function translateColor(sender)
{
	//replaces the manually added tags with colortags for content1. 
	//updateText();
	var textCopy =[];
	textCopy[currentLine] = document.getElementById("content1").innerHTML;
	var tagname = sender.value;
	var openSpanValue = "";
	//for surname
	openSpanValue = '<span style="background-color: rgb(255, 206, 48);">';	
	while(textCopy[currentLine].indexOf(openSpanValue) !==-1)
	{
		var text1 = textCopy[currentLine].substr(0, textCopy[currentLine].indexOf(openSpanValue));
		var text2 = textCopy[currentLine].substr(textCopy[currentLine].indexOf(openSpanValue), textCopy[currentLine].length);
        text2 = text2.replace("</span>", "</surname>");
		textCopy[currentLine] = text1 + text2;
		textCopy[currentLine] = textCopy[currentLine].replace(openSpanValue, '<surname>');
	}
	//for given-names
	openSpanValue = '<span style="background-color: rgb(170, 187, 48);">';	
	while(textCopy[currentLine].indexOf(openSpanValue) !==-1)
	{
		var text1 = textCopy[currentLine].substr(0, textCopy[currentLine].indexOf(openSpanValue));
		var text2 = textCopy[currentLine].substr(textCopy[currentLine].indexOf(openSpanValue), textCopy[currentLine].length).replace("</span>", "</given-names>");
		textCopy[currentLine] = text1 + text2;
		textCopy[currentLine] = textCopy[currentLine].replace(openSpanValue, '<given-names>');
	}
    //for author
	openSpanValue = '<span style="background-color: rgb(255, 150, 129);">';	
	while(textCopy[currentLine].indexOf(openSpanValue) !==-1)
	{				
		var text1 = textCopy[currentLine].substr(0, textCopy[currentLine].indexOf(openSpanValue));
		var text2 = textCopy[currentLine].substr(textCopy[currentLine].indexOf(openSpanValue), textCopy[currentLine].length).replace("</span>", "</author>");
		textCopy[currentLine] = text1 + text2;
		textCopy[currentLine] = textCopy[currentLine].replace(openSpanValue, '<author>');	
	}	
	//for year
	openSpanValue = '<span style="background-color: rgb(191, 177, 213);">';
	while (textCopy[currentLine].indexOf(openSpanValue) !==-1)
	{
		var t1 = textCopy[currentLine].substr(0, textCopy[currentLine].indexOf(openSpanValue));
		var t2 = textCopy[currentLine].substr(textCopy[currentLine].indexOf(openSpanValue), textCopy[currentLine].length).replace("</span>", "</year>")
		textCopy[currentLine] = t1 + t2;
		textCopy[currentLine] = textCopy[currentLine].replace('<span style="background-color: rgb(191, 177, 213);">', '<year>');
	}
    //for title
	while (textCopy[currentLine].indexOf('<span style="background-color: rgb(173, 221, 207);">') !==-1)
	{
		textCopy[currentLine] = textCopy[currentLine].substr(0, textCopy[currentLine].indexOf('<span style="background-color: rgb(173, 221, 207);">')) + textCopy[currentLine].substr(textCopy[currentLine].indexOf('<span style="background-color: rgb(173, 221, 207);">'), textCopy[currentLine].length).replace("</span>", "</article-title>");
		textCopy[currentLine] = textCopy[currentLine].replace('<span style="background-color: rgb(173, 221, 207);">', '<article-title>');
	}
    //for source
	while (textCopy[currentLine].indexOf('<span style="background-color: rgb(171, 225, 253);">') !==-1)
	{
		textCopy[currentLine] = textCopy[currentLine].substr(0, textCopy[currentLine].indexOf('<span style="background-color: rgb(171, 225, 253);">')) + textCopy[currentLine].substr(textCopy[currentLine].indexOf('<span style="background-color: rgb(171, 225, 253);">'), textCopy[currentLine].length).replace("</span>", "</source>");
		textCopy[currentLine] = textCopy[currentLine].replace('<span style="background-color: rgb(171, 225, 253);">', '<source>');
	}
    //for editor
	while (textCopy[currentLine].indexOf('<span style="background-color: rgb(254, 216, 143);">') !==-1)
	{
		textCopy[currentLine] = textCopy[currentLine].substr(0, textCopy[currentLine].indexOf('<span style="background-color: rgb(254, 216, 143);">')) + textCopy[currentLine].substr(textCopy[currentLine].indexOf('<span style="background-color: rgb(254, 216, 143);">'), textCopy[currentLine].length).replace("</span>", "</editor>");
		textCopy[currentLine] = textCopy[currentLine].replace('<span style="background-color: rgb(254, 216, 143);">', '<editor>');
	}
    //for volume
	while (textCopy[currentLine].indexOf('<span style="background-color: rgb(255, 255, 102);">') !==-1)
	{
		textCopy[currentLine] = textCopy[currentLine].substr(0, textCopy[currentLine].indexOf('<span style="background-color: rgb(255, 255, 102);">')) + textCopy[currentLine].substr(textCopy[currentLine].indexOf('<span style="background-color: rgb(255, 255, 102);">'), textCopy[currentLine].length).replace("</span>", "</volume>");
		textCopy[currentLine] = textCopy[currentLine].replace('<span style="background-color: rgb(255, 255, 102);">', '<volume>');
	}
    //fpage
    while (textCopy[currentLine].indexOf('<span style="background-color: rgb(204, 255, 102);">') !==-1)
	{
		textCopy[currentLine] = textCopy[currentLine].substr(0, textCopy[currentLine].indexOf('<span style="background-color: rgb(204, 255, 102);">')) + textCopy[currentLine].substr(textCopy[currentLine].indexOf('<span style="background-color: rgb(204, 255, 102);">'), textCopy[currentLine].length).replace("</span>", "</fpage>");
		textCopy[currentLine] = textCopy[currentLine].replace('<span style="background-color: rgb(204, 255, 102);">', '<fpage>');//
	}
    //lpage
    while (textCopy[currentLine].indexOf('<span style="background-color: rgb(255, 179, 255);">') !==-1)
	{
		textCopy[currentLine] = textCopy[currentLine].substr(0, textCopy[currentLine].indexOf('<span style="background-color: rgb(255, 179, 255);">')) + textCopy[currentLine].substr(textCopy[currentLine].indexOf('<span style="background-color: rgb(255, 179, 255);">'), textCopy[currentLine].length).replace("</span>", "</lpage>");
		textCopy[currentLine] = textCopy[currentLine].replace('<span style="background-color: rgb(255, 179, 255);">', '<lpage>');//
	}
    //other
	while (textCopy[currentLine].indexOf('<span style="background-color: rgb(244, 133, 142);">') !==-1)
	{
		textCopy[currentLine] = textCopy[currentLine].substr(0, textCopy[currentLine].indexOf('<span style="background-color: rgb(244, 133, 142);">')) + textCopy[currentLine].substr(textCopy[currentLine].indexOf('<span style="background-color: rgb(244, 133, 142);">'), textCopy[currentLine].length).replace("</span>", "</other>");
		textCopy[currentLine] = textCopy[currentLine].replace('<span style="background-color: rgb(244, 133, 142);">', '<other>');
	}
	textByLines[currentLine] = textCopy[currentLine];
	    
    var text1 = textByLines[currentLine];
    
    {
        //this part of code solve the problem --> put parent tag begin and end of the whole tag
        var tag_names = ['author','year','article-title','source','editor','fpage','lpage','volum','other'];
        var fisrt_last_name_array = ['surname','given-names'];
        var lenofarray = tag_names.length;
        for (var k = 0; k<lenofarray; k++)
        {
            //alert(tag_names[i]);
            //1
            var openTag = '</'+tag_names[k]+'><surname>';
            var i = 0
            while(text1.indexOf(openTag) !==-1)
            {
                i++;
                text1 = text1.replace(openTag, '<surname>');	
            }
            //*
            var CloseTag = '</surname><'+tag_names[k]+'>';
            var j = 0
            while(text1.indexOf(CloseTag) !==-1)
            {
                j++;
                text1 = text1.replace(CloseTag, '</surname>');	
            }
            //2
            openTag = '</'+tag_names[k]+'><given-names>';
            while(text1.indexOf(openTag) !==-1)
            {
                i++;
                text1 = text1.replace(openTag, '<given-names>');	
            }
            //*
            CloseTag = '</given-names><'+tag_names[k]+'>';
            j = 0
            while(text1.indexOf(CloseTag) !==-1)
            {
                j++;
                text1 = text1.replace(CloseTag, '</given-names>');	
            }
        }
        text1.indexOf(CloseTag)
        //var TagRegExp = new RegExp('<given-names>(.*?)<\/given-names>(.*?)<other>');
        //var TagRegExp = new RegExp('<author><given-names>');
        //if(text1.search(TagRegExp) !==-1 )
        //    alert('yes');
        //////////////////////////////////////////
        /*var openTag = '</author><surname>';
        var i = 0
        while(text1.indexOf(openTag) !==-1)
        {
            i++;
            text1 = text1.replace(openTag, '<surname>');	
        }
        //
        var CloseTag = '</surname><author>';
        var j = 0
        while(text1.indexOf(CloseTag) !==-1)
        {
            j++;
            text1 = text1.replace(CloseTag, '</surname>');	
        }

        
        openTag = '</author><given-names>';
        while(text1.indexOf(openTag) !==-1)
        {
            i++;
            text1 = text1.replace(openTag, '<given-names>');	
        }
        //*
        CloseTag = '</given-names><author>';
        j = 0
        while(text1.indexOf(CloseTag) !==-1)
        {
            j++;
            text1 = text1.replace(CloseTag, '</given-names>');	
        }*/
	}
    
    textFromFileLoaded = text1;
    document.getElementById("txaxml").value = text1;
}

function colorize()
{// replaces the manually added tags with colortags for content1.
	textByLines[currentLine] = document.getElementById("txaxml").value;
	textFromFileLoaded = textByLines.join("");
	
    var textCopy = textByLines;
    //author
	while (textCopy[currentLine].indexOf("<author>") !==-1)
	{
		textCopy[currentLine] = textCopy[currentLine].replace("</author>", "</span>");
		textCopy[currentLine] = textCopy[currentLine].replace('<author>', '<span style="background-color: rgb(255, 150, 129);">');
	}
    //surname
	while (textCopy[currentLine].indexOf("<surname>") !==-1)
	{
		textCopy[currentLine] = textCopy[currentLine].replace("</surname>", "</span>");
		textCopy[currentLine] = textCopy[currentLine].replace('<surname>', '<span style="background-color: rgb(255, 206, 48);">');
	}
    //2
    while (textCopy[currentLine].indexOf('</span><span style="background-color: rgb(255, 206, 48);>') !==-1)
	{
		textCopy[currentLine] = textCopy[currentLine].replace('</span><span style="background-color: rgb(255, 206, 48);>', '<span style="background-color: rgb(255, 206, 48);">');
	}
    //given-names
	while (textCopy[currentLine].indexOf("<given-names>") !==-1)
	{
		textCopy[currentLine] = textCopy[currentLine].replace("</given-names>", "</span>");
		textCopy[currentLine] = textCopy[currentLine].replace('<given-names>', '<span style="background-color: rgb(170, 187, 48);">');
	}
    //2
    while (textCopy[currentLine].indexOf('</span><span style="background-color: rgb(170, 187, 48);">') !==-1)
	{
		textCopy[currentLine] = textCopy[currentLine].replace('</span><span style="background-color: rgb(170, 187, 48);">', '<span style="background-color: rgb(170, 187, 48);">');
	}
    //year
	while (textCopy[currentLine].indexOf("<year>") !==-1)
	{
		textCopy[currentLine] = textCopy[currentLine].replace("</year>", "</span>");
		textCopy[currentLine] = textCopy[currentLine].replace('<year>', '<span style="background-color: rgb(191, 177, 213);">');
	}
	while (textCopy[currentLine].indexOf("<article-title>") !==-1)
	{
		textCopy[currentLine] = textCopy[currentLine].replace("</article-title>", "</span>");
		textCopy[currentLine] = textCopy[currentLine].replace('<article-title>', '<span style="background-color: rgb(173, 221, 207);">');
	}
	while (textCopy[currentLine].indexOf("<source>") !==-1)
	{
		textCopy[currentLine] = textCopy[currentLine].replace("</source>", "</span>");
		textCopy[currentLine] = textCopy[currentLine].replace('<source>', '<span style="background-color: rgb(171, 225, 253);">');
	}
	while (textCopy[currentLine].indexOf("<editor>") !==-1)
	{
		textCopy[currentLine] = textCopy[currentLine].replace("</editor>", "</span>");
		textCopy[currentLine] = textCopy[currentLine].replace('<editor>', '<span style="background-color: rgb(254, 216, 143);">');
	}
    //volume
    while (textCopy[currentLine].indexOf("<volume>") !==-1)
	{
		textCopy[currentLine] = textCopy[currentLine].replace("</volume>", "</span>");
		textCopy[currentLine] = textCopy[currentLine].replace('<volume>', '<span style="background-color: rgb(255, 255, 102);">');
	}
    //fpage
    while (textCopy[currentLine].indexOf("<fpage>") !==-1)
	{
		textCopy[currentLine] = textCopy[currentLine].replace("</fpage>", "</span>");
		textCopy[currentLine] = textCopy[currentLine].replace('<fpage>', '<span style="background-color: rgb(204, 255, 102);">');//
	}
    //lpage
    while (textCopy[currentLine].indexOf("<lpage>") !==-1)
	{
		textCopy[currentLine] = textCopy[currentLine].replace("</lpage>", "</span>");
		textCopy[currentLine] = textCopy[currentLine].replace('<lpage>', '<span style="background-color: rgb(255, 179, 255);">');//
	}
	while (textCopy[currentLine].indexOf("<other>") !==-1)
	{
		textCopy[currentLine] = textCopy[currentLine].replace("</other>", "</span>");
		textCopy[currentLine] = textCopy[currentLine].replace('<other>', '<span style="background-color: rgb(244, 133, 142);">');
	}
	document.getElementById("content1").innerHTML = textCopy[currentLine];
	
}

//for Deleting Tags/////////////////////////////////////////////////////////////////////////////////////////
var textarea1 = "";
function preventDeleteChar(event)
{
	
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
		
		openTag = "<article-title>";
		closeTag = "</article-title>";
		closeTag2 = "/title>";
		openTagRegExp = new RegExp('<title(?!>)|(title>)|<titl>|<tite>|<tile>|<ttle>|<itle>'); //|(?!<)title>
		closeTagRegExp = new RegExp('<\/title(?!>)|<\/titl>|<\/tite>|<\/tile>|<\/ttle>|<\/itle>');//|(?!<)/title>
		deleteTagsfun(openTag, closeTag, closeTag2, openTagRegExp, closeTagRegExp);
		if (deleteTagsfun(openTag, closeTag, closeTag2, openTagRegExp, closeTagRegExp))
			flag= true;
		
		openTag = "<source>";
		closeTag = "</source>";
		closeTag2 = "/source>";
		openTagRegExp = new RegExp('<source(?!>)|(source>)|<containe>|<containr>|<contaier>|<contaner>|<continer>|<conainer>|<cotainer>|<cntainer>|<ontainer>'); //|(?!<)source>;
		closeTagRegExp = new RegExp('<\/source(?!>)|<\/containe>|<\/containr>|<\/contaier>|<\/contaner>|<\/continer>|<\/conainer>|<\/cotainer>|<\/cntainer>|<\/ontainer>');//|(?!<)/source>
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
	
		openTag = "<given-names>";
		closeTag = "</given-names>";
		closeTag2 = "/given-names>";
		openTagRegExp = new RegExp('<given-names(?!>)|(given-names>)|<firstnam>|<firstnae>|<firstnme>|<firstame>|<firsname>|<firtname>|<fistname>|<frstname>|<irstname>');
		closeTagRegExp = new RegExp('<\/given-names(?!>)|<\/firstnam>|<\/firstnae>|<\/firstnme>|<\/firstame>|<\/firsname>|<\/firtname>|<\/fistname>|<\/frstname>|<\/irstname>');
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

/////for popup
 var popUpFlag = false;
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
    return parentEl;
}

$(document).click(function(event){
    
    //alert(document.getElementsByClassName("popup").value);
    var popup = document.getElementById("myPopup");
    if(popUpFlag == true){
        popup.classList.toggle("show");
		popUpFlag = false;

    }
    
});

$("#content1").click(function(event) {
    
    //event.stopPropagation(); // i read that this might be harmful to other functions
    //document.getElementById("myPopup").classList.add('popuphidden');
    //document.getElementById("myPopup").css("visibility", "hidden");
    var popup = document.getElementById("myPopup");
    if(popUpFlag == true){
        popup.classList.toggle("show");
		popUpFlag = false;

    }
});

$("#delbtnno").click(function(event) {
    //alert($("#popupdiv").is(':visible'))
    var popup = document.getElementById("myPopup");
    popup.classList.toggle("show");
    popUpFlag = false;
    //alert($("#popupdiv").is(':visible'));
});

$("#btntest").click(function(event) {
    document.getElementById("popupdiv").classList.add('popuphidden');
    alert($("#popupdiv").is(':visible'))
    
});


$("#content").mouseup(function(){
    
    var popup = document.getElementById("myPopup");
    
    sel = window.getSelection();
	if (sel != "")
	{        
        if (sel.anchorNode.parentElement.toString()== "[object HTMLSpanElement]")
        {
            //alert(sel);
            $('#myPopup').css('left',event.pageX-85 ); // -14 and -310 account for the top and left border(maybe there is an other way)
            $('#myPopup').css('top',event.pageY-85 );
            $('#myPopup').css('display','inline');     
            $("#myPopup").css("position", "absolute");
            popup.classList.toggle("show");
            if(popUpFlag == false)
            {
                popUpFlag= true;
            }
            
        }
        else if(popUpFlag == true){
            popup.classList.add('popuphidden');
            popUpFlag = false;
        }    
        //alert("Mouse button released.");
    }
});

$("#content1").dblclick(function(event) 
{
    var par = getSelectionParentElement().nodeName;
    var popup = document.getElementById("myPopup");
    //alert(par);
    if(par == "SPAN")
    {
        $('#myPopup').css('left',event.pageX-120 ); // -14 and -310 account for the top and left border(maybe there is an other way)
        $('#myPopup').css('top',event.pageY-90 );
        $('#myPopup').css('display','inline');     
        $("#myPopup").css("position", "absolute");
        popup.classList.toggle("show");
        if(popUpFlag == false)
        {
            popUpFlag= true;
        }     
    }
    else if(popUpFlag == true){
        popup.classList.toggle("show");
		popUpFlag = false;
    }    
});




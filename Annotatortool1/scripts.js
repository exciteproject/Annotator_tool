var textFromFileLoaded = "";
var textByLines = "";
var currentLine = 0;
var pdfFileName = "";
var textFileName = "";
var cols1 =[];
var cols2 =[];
var colorCounter = 0;
var showTagDivFlag = false;

function emptyParameters()
{
	textFromFileLoaded = "";
	textByLines = "";
	currentLine = 0;
    document.getElementById("errorMsg").innerHTML = "";
    colorCounter = 0;
    //document.getElementById("txtSize").innerHTML = "";
    //$("#btndeltxt").hide();
    //document.getElementById("content1").innerHTML = "";
	//document.getElementById("ptxaxml").innerHTML = "";
    //pdfFileName = "";
    //textFileName = ""
}

$(document).ready(function()
{
    $("#btnUpdateTags").click(function(){
        $("#spinner").show("slow", function(){
            //adding ref Tags to the text accourding colors
            translateColor_ToTag();
            $("#spinner").hide("slow");
        });
    });
    
    $("#btndeltxt").click(function(){
        //for remove the selected file 
        document.getElementById("txtSize").innerHTML = "";
        $("#btndeltxt").hide();
        textFromFileLoaded = "";
        textByLines = "";
        currentLine = 0;
        document.getElementById("btnUploadText").value = "";
        document.getElementById("content1").innerHTML = "";
        document.getElementById("ptxaxml").innerHTML = "";
        document.getElementById("errorMsg").innerHTML = "";        
        textFileName = "";
        checkFilesName_Similarity();
    });
    $("#btndelpdf").click(function(){
        //for remove the selected file 
        document.getElementById("pdfSize").innerHTML = "";
        $("#btndelpdf").hide();
        document.getElementById("btnUploadPdf").value = "";
        document.getElementById("pdfiframe").src ="";
        document.getElementById("errorMsg").innerHTML = "";
        pdfFileName = "";
        checkFilesName_Similarity();
    });
    
    $("#showTagedTextdiv").click(function()
    {
        if (textFileName == "") 
        {
            alert("No Text to Show!");
            return;
        }
        if (showTagDivFlag == false)
        {
            //$("#tagedTextdiv").toggle("slide", { direction: "down" }, 1000);
            $("#spinner").show("slow", function(){
                //adding ref Tags to the text accourding colors
                translateColor_ToTag();
                $("#spinner").hide("slow");
            });
            //showTagDivFlag = true;
            
        } else
        {
            //$("#tagedTextdiv").toggle("slide", { direction: "down" }, 1000);
            //showTagDivFlag = false;
        }
    });
    
    $("#btnRefex").click(function()
    {
        var path = "PDF/9180-46915.pdf";
        document.getElementById('pdfiframe').src = "web/viewer.html?file="+path;
        //call_refex();
    });
});
//call webservice////////////////////////////////////////////////////////////////////////////////////////////////
function call_refex(){
    //if (xhr.readyState == XMLHttpRequest.DONE) {

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("content1").innerHTML =
      this.responseText;
    }
  };
  xhttp.open("GET", "http://193.175.238.110:8080/server-ws-3/webapi/myresource", true);
  xhttp.send();
}
//////////////////////////////////////////////////////////////////////////////////////////////////

function checkFileAvailability_ReturnFileName(x)
{
	//check FileAvailability and ReturnFileName
	//var x = document.getElementById("btnUploadText");
	var filename = "";
	var txt = "";
	if ('files' in x)
	{
		for (var i = 0; i < x.files.length; i++)
		{  
			var file = x.files[i];
			if ('name' in file) txt += "File Name : " + file.name;
			filename =  file.name;
		}
	}	
	else 
	{
		if (x.value == "")  txt += "Select one or more files.";
		else {
            // If the browser does not support the files property, it will return the path of the selected file instead.
			txt += "The files property is not supported by your browser!";
			txt  += "<br>The path of the selected file: " + x.value;  
		}
        alert(txt);
	}	
	return filename.split('.')[0];
}

function show_FileName()
{
	//return the filename of anything uploaded through button "btnUploadText" 
	var x = document.getElementById("btnUploadText");
	var filename = "";
	var txt = "";
	if ('files' in x) 
	{
		for (var i = 0; i < x.files.length; i++) //made for any amount of uploaded files 
		{  
			var file = x.files[i];
			if ('name' in file) txt += "File Name : " + file.name;
			filename =  file.name;
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
	//
	return filename;
}

function checkFilesName_Similarity()
{
    //announce user to upload a correct files
    //Check if the name of files is same or not
    if (textFileName == "")
    {
        alert("Please Select a Text File.");
        document.getElementById("errorMsg").innerHTML = "Please Select a Text File.";
        return;
    }
    if (pdfFileName == "")
    {
        //alert("Please Select a PDF File.");
        document.getElementById("errorMsg").innerHTML = "Please Select a PDF File.";
        return;
    }
    else if (textFileName != pdfFileName)
    {
        alert("Text File AND PDF File are Different.");
        document.getElementById("errorMsg").innerHTML = "Text File AND PDF File are Different.";
    }    
}

function getFile_Size(sender)
{
    var _size = sender.files[0].size;
    var fSExt = new Array('Bytes', 'KB', 'MB', 'GB'),
    i=0;
    while(_size>900){_size/=1024;i++;}
    var exactSize = (Math.round(_size*100)/100)+' '+fSExt[i];
    return exactSize;
}

function show_PdfFile() 
{   
    emptyParameters();
    
    //Check Availibality
    var x = document.getElementById("btnUploadPdf");
    pdfFileName = checkFileAvailability_ReturnFileName(x);
    //alert(pdfFileName);
    if (pdfFileName == "")
    {
        alert("No File Selected!!!");
        return false;
    }
    
    //Check Type
    var validExts = new Array(".pdf");
    var fileExt = x.value;
    fileExt = fileExt.substring(fileExt.lastIndexOf('.'));
    if (validExts.indexOf(fileExt) < 0) {
      alert("Invalid file selected, valid files are of " + validExts.toString() + " types.!!! ");
      return false;
    }    
    document.getElementById("pdfSize").innerHTML = getFile_Size(x);
    
    //Show File 
    var file = x.files[0];
    var tmppath = URL.createObjectURL(file);
    document.getElementById('pdfiframe').src = "web/viewer.html?file="+tmppath;
    $("#btndelpdf").show();
    //check pdf and pdf Similarity
    checkFilesName_Similarity();

}

function show_TextFile()
{
    emptyParameters(); 
    
    //Check Availibality
    var x = document.getElementById("btnUploadText");
    textFileName = checkFileAvailability_ReturnFileName(x);
    if (textFileName == "")
    {
        alert("No File Selected!!!");
        return false;
    }    
    
    //Check Type
    var validExts = new Array(".txt", ".xml");
    var fileExt = x.value;    
    fileExt = fileExt.substring(fileExt.lastIndexOf('.'));
    if (validExts.indexOf(fileExt) < 0) {
      alert("Invalid file selected, valid files are of " + validExts.toString() + " types.");
      return false;
    }
    //show File Size
    document.getElementById("txtSize").innerHTML = getFile_Size(x);
    
    $("#btndeltxt").show();
    
    //Show Text in page 
     $("#spinner").show("slow", function(){
            loadFile_AsText();
            $("#spinner").hide("slow");
        });
	
    //check Similarity of pdf and text files
    checkFilesName_Similarity();

}

function loadFile_AsText()
{
	//loads the file into the textareas "content1" and "ptxaxml"
	var fileToLoad = document.getElementById("btnUploadText").files[0];
	var fileReader = new FileReader();
    
	fileReader.onload = function(fileLoadedEvent)
	{
		textFromFileLoaded = fileLoadedEvent.target.result;
		//converts textfile into array of lines cutting whenever "\n" is in the file
		textByLines = textFromFileLoaded.split('\n');

		var temp= "";
        var colslen = 0;
        
        var i =0;
		for (i = 0; i < textByLines.length ; i++)  
		{
            //split every line by tab put in a array
            var arrayofcolumn = textByLines[i].split('\t');
            colslen = arrayofcolumn.length;
            //put first part in first item of array. we will show this part
            cols1[i] = arrayofcolumn[0];
            //second part will added to first part in saving file as xml
            cols2[i]= textByLines[i].split(cols1[i])[1]
            
            //var sss = cols1[i] + cols2[i];
            //content1 as a lable cant undrestand "\n". we should add <br> at the end of each line			
            if ( i == textByLines.length-1)
                temp = temp + cols1[i];
            else temp = temp + cols1[i] + '<br>';
		}
        
		//document.getElementById("content1").innerHTML = temp;
        //document.getElementById("ptxaxml").innerHTML = temp;
        //document.getElementById("lblMsg").innerHTML = document.getElementById("lblMsg").innerHTML +  cols1.length + " " + cols2.length;
		colorizeText_InLable(temp);	        
	};			
	fileReader.readAsText(fileToLoad, "UTF-8");    
}

function colorizeText_InLable(temp)
{
    // replaces the <ref> tags with color tags for content1.
	var textCopy = temp;
	while (textCopy.indexOf("<ref>") !==-1)
	{
		textCopy = textCopy.replace("</ref>", "</span>");
        if(colorCounter == 6)
		{
			textCopy = textCopy.replace('<ref>', '<span style="background-color: rgb(111, 252, 226);">');
			colorCounter = 0;
		}
		else if(colorCounter == 5)
		{
			textCopy = textCopy.replace('<ref>', '<span style="background-color: rgb(244, 132, 112);">');
			colorCounter = colorCounter+1;
		}
		else if(colorCounter == 4)
		{
			textCopy = textCopy.replace('<ref>', '<span style="background-color: rgb(135, 245, 168);">');
			colorCounter = colorCounter+1;
		}
		else if(colorCounter == 3)
		{
			textCopy = textCopy.replace('<ref>', '<span style="background-color: rgb(152, 230, 249);">');
			colorCounter = colorCounter+1;
		}
		else if(colorCounter == 2)
		{
			textCopy = textCopy.replace('<ref>', '<span style="background-color: rgb(236, 184, 249);">');
			colorCounter = colorCounter+1;
		}
		else if(colorCounter == 1)
        {
            textCopy = textCopy.replace('<ref>', '<span style="background-color: rgb(252, 201, 108);">');
            colorCounter = colorCounter+1;
        }
		else if(colorCounter == 0)
        {
            textCopy = textCopy.replace('<ref>', '<span style="background-color: rgb(255, 255, 153);">');
            colorCounter = colorCounter+1;
        }
	}
    document.getElementById("content1").innerHTML = textCopy;
    //ptxaxml as a lable cant undrestand "br". we should add <\n> at the end of each line
    openSpanValue = '<br>';
	var i = 0
    var ptxaxmltext = ""
	while(temp.indexOf(openSpanValue) !==-1)
	{
		i++;
		temp = temp.replace(openSpanValue, '\n');
	}
    document.getElementById("ptxaxml").innerHTML = temp;
}

function saveText_AsXmlFile()
{
	if (document.getElementById("content1").innerHTML == "")
    {
        alert('No File Selected');
        return;
    }
    
    $("#spinner").show("slow", function()
    {            
        translateColor_ToTag();        

        var textToWrite = document.getElementById("ptxaxml").innerHTML.split('\n');
        
        var textToWrite2 = [];
        
        for (var i = 0; i < textToWrite.length; i++)  
		{
            if (i == textToWrite.length-1)
                textToWrite2[i] = textToWrite[i] + cols2[i];
            else 
                textToWrite2[i] = textToWrite[i] + cols2[i] + '\n';
        }
        //document.getElementById("lblMsg").innerHTML = textToWrite2.join("");
        textToWrite2 = textToWrite2.join("");
        var textFileAsBlob = new Blob([textToWrite2], {type:'text/plain'});
        //get file name
        var fullPath = document.getElementById('btnUploadText').value;
        
        if (fullPath) {
            var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
            var filename = fullPath.substring(startIndex);
            if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
                filename = filename.substring(1).split('.')[0];
            }
        }
        var fileNameToSaveAs = filename + ".xml";
        
        download(textToWrite2, fileNameToSaveAs); 
        $("#spinner").hide("slow");
    });
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

function change_TxtColor() 
{
    //change color for selected text in lable by execCommand
	// Get Selection
	if (document.getElementById("content1").innerHTML == "")
	{ 
		alert('Please Select a file');
		return;
	}
    
	sel = window.getSelection();
	var selectedtext = sel.toString();	
    if (selectedtext == "")
    {
		alert('Please Select Text');
		return;        
    }
    alert(selectedtext);
    alert(selectedtext.split("\n").length);
    if (sel.rangeCount && sel.getRangeAt) 
    {
        range = sel.getRangeAt(0);
    }
    // Set design mode to on
    document.designMode = "on";
    if (range) {
        sel.removeAllRanges();
        sel.addRange(range);
    }
    //Colorize text
    if(colorCounter == 6)
	{
		document.execCommand("HiliteColor", false, "#6ffce2");
		colorCounter = 0;
	}
	else if(colorCounter == 5)
	{
		document.execCommand("HiliteColor", false, "#f48470");
		colorCounter = colorCounter+1;
	}
	else if(colorCounter == 4)
	{
		document.execCommand("HiliteColor", false, "#87f5a8");
		colorCounter = colorCounter+1;
	}
	else if(colorCounter == 3)
	{
		document.execCommand("HiliteColor", false, "#98e6f9");
		colorCounter = colorCounter+1;
	}
	else if(colorCounter == 2)
	{
		document.execCommand("HiliteColor", false, "#ecb8f9");
		colorCounter = colorCounter+1;
	}
	else if(colorCounter == 1)
    {
		document.execCommand("HiliteColor", false, "#fcc96c");
		colorCounter = colorCounter+1;
    }
    else if (colorCounter == 0)
    {
        document.execCommand("HiliteColor", false, "#ffff99");
        colorCounter = colorCounter+1;
    }
    // Set design mode to off
    document.designMode = "off";
    //translate color to tag will takes time because on \n. we omitted it
    //translateColor_ToTag();
        /////////////////////////////////////////////////////////
    //var y = document.body.innerHTML; OK
    //var x = document.getElementsByTagName("BODY")[0].innerHTML;  OK
    //var bodyHtml = /<body.*?>([\s\S]*)<\/body>/.exec(entirePageHTML)[1]; Not Check
    
    var iframe = document.getElementById('pdfiframe');
    //alert(iframe.src);
    var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    if (iframeDocument)
    {
        var sss = iframeDocument.body.innerHTML;
        if (sss != "")
        {
            //alert(sss);
            var eee = iframeDocument.getElementById('viewerContainer').innerHTML
            //alert(eee);
            //alert(eee.search(selectedtext));
            //eee.search(selectedtext).replaceWith("<span class='highlight'>"+selectedtext +"</span>");           
            //iframeDocument.body.innerHTML = "Hello Pdf";
            //iframe.src = "";
            //iframeDocument.location.reload();
        }
    }
    
    //var iBody = $("pdfiframe").contents().find("body");
    //var iBodyhtml = iBody.html;
    //var myContent = iBody.find("viewerContainer");
    
    //var ssssss = myContent.innerHTML;
    
    //var iframe = $('pdfiframe').contents();
    //var iframeInner = $(iframe).find('viewerContainer').contents();
    //.attr('onclick', null)
    //.addClass
    //$(iframe).find('html').replaceWith();
    //alert(document.getElementById('pdfiframe').innerHTML);
    //alert(document.getElementById('textLayer').innerHTML);  
    ////////////////////////////////////////////////////////////////////////////
}

function translateColor_ToTag()
{
    // ptxaxml cant undrestand <span> tag and <br>
    // replaces the <span> tags with <ref> tag for ptxaxml.
	var textCopy = document.getElementById("content1").innerHTML;
	var openSpanValue0 = '<span style="background-color: rgb(255, 255, 153);">';
	var openSpanValue1 = '<span style="background-color: rgb(252, 201, 108);">';
	var openSpanValue2 = '<span style="background-color: rgb(236, 184, 249);">';
	var openSpanValue3 = '<span style="background-color: rgb(152, 230, 249);">';
    var openSpanValue4 = '<span style="background-color: rgb(135, 245, 168);">';
    var openSpanValue5 = '<span style="background-color: rgb(244, 132, 112);">';
    var openSpanValue6 = '<span style="background-color: rgb(111, 252, 226);">';
    
    //var re = new RegExp(/<span style="background-color: rgb\(255, 150, 129\);"/g);
	while(textCopy.indexOf(openSpanValue0) !==-1)
	{				
		var text1 = textCopy.substr(0, textCopy.indexOf(openSpanValue0));
		var text2 = textCopy.substr(textCopy.indexOf(openSpanValue0), textCopy.length).replace("</span>", "</ref>");
		textCopy = text1 + text2;
		textCopy = textCopy.replace(openSpanValue0, '<ref>');	
	}
    
    while(textCopy.indexOf(openSpanValue1) !==-1)
	{				
		var text1 = textCopy.substr(0, textCopy.indexOf(openSpanValue1));
		var text2 = textCopy.substr(textCopy.indexOf(openSpanValue1), textCopy.length).replace("</span>", "</ref>");
		textCopy = text1 + text2;
		textCopy = textCopy.replace(openSpanValue1, '<ref>');	
	}
	while(textCopy.indexOf(openSpanValue2) !==-1)
	{				
		var text1 = textCopy.substr(0, textCopy.indexOf(openSpanValue2));
		var text2 = textCopy.substr(textCopy.indexOf(openSpanValue2), textCopy.length).replace("</span>", "</ref>");
		textCopy = text1 + text2;
		textCopy = textCopy.replace(openSpanValue2, '<ref>');	
	}
	while(textCopy.indexOf(openSpanValue3) !==-1)
	{				
		var text1 = textCopy.substr(0, textCopy.indexOf(openSpanValue3));
		var text2 = textCopy.substr(textCopy.indexOf(openSpanValue3), textCopy.length).replace("</span>", "</ref>");
		textCopy = text1 + text2;
		textCopy = textCopy.replace(openSpanValue3, '<ref>');	
	}
	while(textCopy.indexOf(openSpanValue4) !==-1)
	{				
		var text1 = textCopy.substr(0, textCopy.indexOf(openSpanValue4));
		var text2 = textCopy.substr(textCopy.indexOf(openSpanValue4), textCopy.length).replace("</span>", "</ref>");
		textCopy = text1 + text2;
		textCopy = textCopy.replace(openSpanValue4, '<ref>');	
	}
    while(textCopy.indexOf(openSpanValue5) !==-1)
	{				
		var text1 = textCopy.substr(0, textCopy.indexOf(openSpanValue5));
		var text2 = textCopy.substr(textCopy.indexOf(openSpanValue5), textCopy.length).replace("</span>", "</ref>");
		textCopy = text1 + text2;
		textCopy = textCopy.replace(openSpanValue5, '<ref>');	
	}
    while(textCopy.indexOf(openSpanValue6) !==-1)
	{				
		var text1 = textCopy.substr(0, textCopy.indexOf(openSpanValue6));
		var text2 = textCopy.substr(textCopy.indexOf(openSpanValue6), textCopy.length).replace("</span>", "</ref>");
		textCopy = text1 + text2;
		textCopy = textCopy.replace(openSpanValue6, '<ref>');	
	}
    // ptxaxml cant undrestand <br> we should replace it with \n
	var openTagValue = '<br>';
	var i = 0
	while(textCopy.indexOf(openTagValue) !==-1)
	{
		i++;
		textCopy = textCopy.replace(openTagValue, '\n');	
	}
    document.getElementById("ptxaxml").innerHTML = textCopy;	
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
		$(sel.anchorNode.parentElement).contents().unwrap();
        document.getElementById("myPopup").classList.toggle("show");
		popUpFlag = false;
	}
	//alert(sel);
}

function RemoveTag1(sender)
{
    var par = getSelectionParentElement().nodeName;
    alert(par);
    sel = window.getSelection();
	//alert(sel.anchorNode.parentElement.toString());
	if(par == "SPAN")
	{
		//alert('yes');
		$(par).contents().unwrap();
		translateColor_ToTag(sender);
	}
	//alert(sel);
}

function RemoveTagOld0(sender)
{

	sel = window.getSelection();
	var selectedtext = sel.toString();	
	
    if (sel.rangeCount && sel.getRangeAt) {
        range = sel.getRangeAt(0);
    }
    // Set design mode to on
    document.designMode = "on";
    if (range) {
        sel.removeAllRanges();
        sel.addRange(range);
    }
	document.execCommand("removeFormat", false, "foreColor");
	document.designMode = "off";
	translateColor_ToTag(sender);	
    
}

//tripleclick
window.addEventListener('click', function (evt) {
    if (evt.detail === 3) {
        //alert('triple click!');
        sel = window.getSelection();
		newNode = document.createElement("p");
		range = sel.getRangeAt(0);
        //sel = sel.
		//range.surroundContents(newNode);//now i would need a new range(i think) 
		//alert(range.endOffset);
		//alert(range.commonAncestorContainer);
		//alert(range.endContainer);
		if(range.endOffset != 0)
		{
			range.setEnd(range.endContainer, range.endOffset - 1);
		}
		else
		{
			//alert(range.endContainer.previousSibling)
			range.setEnd(range.endContainer.previousSibling, range.endOffset);
			//alert(range.endOffset)
		}
		//alert(range.endContainer);
		//alert(sel.rangeCount);
        change_TxtColor();
    }
});

//popup code section /////////////////////////////

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

$("#content1").click(function(event) 
{   
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

$("#pdfiframe").click(function(event) {
    document.getElementById("myPopup").classList.add('popuphidden'); // i read that this might be harmful to other functions
    alert("click on pdfiframe");
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
    sel = window.getSelection();
    //alert(sel);
    //range = sel.getRangeAt(0).cloneRange();
    //alert(range.startOffset + range.endOffset);
    //alert(range.startContainer + range.endContainer);
    //alert(range.extractContents());
    //alert(sel.anchorNode.parentElement.parentElement.toString());
    //alert(sel.anchorNode.parentElement.innerHTML)
    var par = getSelectionParentElement().nodeName;
    var popup = document.getElementById("myPopup");
    
    if(par == "SPAN")
    {
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
        popup.classList.toggle("show");
		popUpFlag = false;
    }    
});
//////////////////////////////////

var pdfFileName = "";
var textFileName = "";
var cols1text = [];
var cols2numbers = [];
var colorCounter = 0;
var currentLine = 0;
var arrayOfLines = "";

// array for colors definition
var openSpanValue_arr = ['<span style="background-color: rgb(255, 255, 153);">',
    '<span style="background-color: rgb(252, 201, 108);">',
    '<span style="background-color: rgb(236, 184, 249);">',
    '<span style="background-color: rgb(152, 230, 249);">',
    '<span style="background-color: rgb(135, 245, 168);">',
    '<span style="background-color: rgb(244, 132, 112);">',
    '<span style="background-color: rgb(111, 252, 226);">'];

var spanColors_arr = ["#ffff99", "#fcc96c", "#ecb8f9", "#98e6f9", "#87f5a8", "#f48470", "#6ffce2"];

// empty some elements when page is refresh
function emptyParameters() {
    document.getElementById("errorMsg").innerHTML = "";
    colorCounter = 0;
    arrayOfLines = "";
    currentLine = 0;
}

// assign key down to buttons 
document.addEventListener('keydown', function (event) {
    sel = window.getSelection();
    var selectedtext = sel.toString();
    if (selectedtext == '')
        return;
    else if (event.keyCode == 105) {
        // alert('ii was pressed');
        ChangeColor_TranslateColor('ref_line');
    } else if (event.keyCode == 114) {
        // alert('rr was pressed');
        RemoveTag();
    }
    else if (event.keyCode == 111) {
        ChangeColor_TranslateColor('other'); 
    }
    else if (event.keyCode == 112) {
        // alert('ii was pressed');
        ChangeColor_TranslateColor('ref_part');
    } 
});

// document.ready functions
$(document).ready(function () {
    // help show 
    $("#btnhelp").click(function () {
        $("#light").show("slow");
        $("#fade").show("slow");
        // document.getElementById("light").style.display = 'block';
        // document.getElementById("fade").style.display = 'block'
    });

    $("#btnClose").click(function () {
        $("#light").hide("slow");
        $("#fade").hide("slow");
        // document.getElementById('light').style.display='none';
        // document.getElementById('fade').style.display='none';
    });

    // reload 
    $("#btnReload").click(function () {
        location.reload();
    });

    $("#btndeltxt").click(function () {
        //for remove the selected file 
        document.getElementById("txtSize").innerHTML = "";
        $("#btndeltxt").hide();
        document.getElementById("content1").innerHTML = "";
        document.getElementById("ptxaxml").innerHTML = "";
        document.getElementById("errorMsg").innerHTML = "";
        textFileName = "";
        checkFilesName_Similarity();
    });

    $("#btndelpdf").click(function () {
        //for remove the selected file 
        document.getElementById("pdfSize").innerHTML = "";
        $("#btndelpdf").hide();
        document.getElementById("btnUploadPdf").value = "";
        document.getElementById("pdfiframe").src = 'about:blank';
        document.getElementById("errorMsg").innerHTML = "";
        pdfFileName = "";
        checkFilesName_Similarity();
    });

    $("#showTagedTextdiv").click(function () {
        if (document.getElementById("content1").innerHTML == "") {
            alert("No Text to Show!");
            return;
        }
        $("#spinner").show("slow", function () {
            //adding ref Tags to the text accourding colors
            //translateColor_ToTag();
            translateColor()
            var temp = document.getElementById("ptxaxml").innerHTML;
            temp = temp.replace(/OPENTAGINTEXT/g, "<").replace(/SLASHINTEXT/g, "/");
            //console.log(temp)
            document.getElementById("ptxaxml").innerHTML = temp;
            $("#spinner").hide("slow");
        });
    });
});
//////////////////////////////////////////////////////////////////////////////////////////////////

function checkFileAvailability_ReturnFileName(x) {
    //check FileAvailability and ReturnFileName
    var filename = [];
    var txt = "";
    if ('files' in x) {
        for (var i = 0; i < x.files.length; i++) {
            var file = x.files[i];
            if ('name' in file) txt += "File Name : " + file.name;
            filename.push(file.name);
        }
    }
    else {
        if (x.value == "") txt += "Select one or more files.";
        else {
            // If the browser does not support the files property, it will return the path of the selected file instead.
            txt += "The files property is not supported by your browser!";
            txt += "<br>The path of the selected file: " + x.value;
        }
        alert(txt);
    }
    return filename;
}

function checkFilesName_Similarity() {
    //announce user to upload a correct files
    //Check if the name of files is same or not
    if (textFileName == "") {
        document.getElementById("errorMsg").innerHTML = "Please Select a Text/XML File.";
        return;
    }
    if (pdfFileName == "") {
        document.getElementById("errorMsg").innerHTML = "Please Select a PDF File.";
        return;
    }
    else if (textFileName.split('.')[0] != pdfFileName.split('.')[0]) {
        alert("Text File AND PDF File are Different.");
        document.getElementById("errorMsg").innerHTML = "Text/XML File AND PDF File are Different.";
    }
}

function getFile_Size(filesize) {
    var _size = filesize;
    var fSExt = new Array('Bytes', 'KB', 'MB', 'GB'),
        i = 0;
    while (_size > 900) { _size /= 1024; i++; }
    var exactSize = (Math.round(_size * 100) / 100) + ' ' + fSExt[i];
    return exactSize;
}

function show_bothFile() {
    emptyParameters();
    var x = document.getElementById("btnUploadbothfile");
    // check file type and return names as an array
    filenames = checkFileAvailability_ReturnFileName(x);
    textFileName = filenames;
    var arrayLength = filenames.length;
    if (arrayLength > 2) {
        alert('Please choose less than 3 file.');
        return false;
    }
    if (arrayLength == 0) {
        alert("No File Selected!!!");
        return false;
    }

    //Check File Type again by code
    var validExts = new Array("pdf", "txt", "xml");
    for (var i = 0; i < arrayLength; i++) {
        var fileExt = filenames[i].split('.')[1];
        if (!validExts.includes(fileExt))
            alert(fileExt + " --> is Invalid type, valid types are [" + validExts.toString() + "].!!! ");
        else {
            if (fileExt == 'pdf')
                document.getElementById("pdfSize").innerHTML = filenames[i];
            else if (fileExt == 'txt' || fileExt == 'xml')
                document.getElementById("txtSize").innerHTML = filenames[i];
            textFileName = filenames[i];
            // alert(filename);
        }
    }
    checkFilesName_Similarity();
    if ('files' in x) {
        for (var i = 0; i < x.files.length; i++) {
            var file = x.files[i];
            var fileExts = file.name.split('.')[1]
            if (fileExts == 'pdf') {
                //Show pdf File 
                var file = x.files[i];
                var tmppath = URL.createObjectURL(file);
                document.getElementById('pdfiframe').src = "web/viewer.html?file=" + tmppath;
                $("#btndelpdf").show();
                document.getElementById("pdfSize").innerHTML += ' (' + getFile_Size(file.size) + ')';
            }
            if (fileExts == 'txt' || fileExts == 'xml') {
                var file = x.files[i];
                //Show Text in page 
                $("#spinner").show("slow", function () {
                    loadFile_AsText(file);
                    $("#spinner").hide("slow");
                });
                $("#btndeltxt").show();
                document.getElementById("txtSize").innerHTML += ' (' + getFile_Size(file.size) + ')';
            }
        }
    }
}

function loadFile_AsText(fileToLoad) {
    document.getElementById("content1").innerHTML = "";
    document.getElementById("ptxaxml").innerHTML = "";
    var textFromFileLoaded = "";
    //loads the file into the textareas "content1" and "ptxaxml"
    var fileReader = new FileReader();
    fileReader.onload = function (fileLoadedEvent) {
        textFromFileLoaded = fileLoadedEvent.target.result;
        //converts textfile into array of lines cutting whenever "\n" is in the file
        var text_Lines = textFromFileLoaded.split('\n');

        var temp = "";
        var colslen = 0;

        var i = 0;
        for (i = 0; i < text_Lines.length; i++) {
            //split every line by tab put in a array
            var arrayofcolumn = text_Lines[i].split('\t');
            colslen = arrayofcolumn.length;
            //put first part in first item of array. we will show this part
            cols1text[i] = arrayofcolumn[0];
            //second part will added to first part in saving file as xml
            // cols2numbers[i] = text_Lines[i].split(cols1text[i])[1];
            lenofcolone = cols1text[i].length;
            cols2numbers[i] = text_Lines[i].slice(lenofcolone);
            //content1 as a lable cant undrestand "\n". we should add <br> at the end of each line			
            cols1text[i] = cols1text[i].replace(/</g, "OPENTAGINTEXT");
            cols1text[i] = cols1text[i].replace(/\//g, "SLASHINTEXT");
            cols1text[i] = cols1text[i].replace(/OPENTAGINTEXTref>/g, "<ref>");
            cols1text[i] = cols1text[i].replace(/OPENTAGINTEXTSLASHINTEXTref>/g, "</ref>")
            cols1text[i] = cols1text[i].replace(/OPENTAGINTEXToth>/g, "<oth>");
            cols1text[i] = cols1text[i].replace(/OPENTAGINTEXTSLASHINTEXToth>/g, "</oth>")
            if (i == text_Lines.length - 1)
                temp = temp + cols1text[i];
            else temp = temp + cols1text[i] + '<br>';
        }

        colorizeText_InLable(temp);
    };
    fileReader.readAsText(fileToLoad, "UTF-8");
}

function colorizeText_InLable(temp) {
    // replaces the <ref> tags with color tags for content1.
    var textCopy = temp;
    while (textCopy.indexOf("<ref>") !== -1) {
        textCopy = textCopy.replace("</ref>", "</span>");
        if (colorCounter == 6) {
            textCopy = textCopy.replace('<ref>', openSpanValue_arr[6]);
            colorCounter = 0;
        }
        else if (colorCounter < 6) {
            textCopy = textCopy.replace('<ref>', openSpanValue_arr[colorCounter]);
            colorCounter = colorCounter + 1;
        }
    }
    
     while (textCopy.indexOf("<oth>") !== -1) {
        textCopy = textCopy.replace("</oth>", "</span>");
        textCopy = textCopy.replace('<oth>', '<span style="background-color: rgb(162, 165, 165);">');
        }

    
    document.getElementById("content1").innerHTML = textCopy;
    //ptxaxml as a lable cant undrestand "br". we should add "\n" at the end of each line
    openSpanValue = '<br>';
    var i = 0
    var ptxaxmltext = ""
    while (temp.indexOf(openSpanValue) !== -1) {
        i++;
        temp = temp.replace(openSpanValue, '\n');
    }
    document.getElementById("ptxaxml").innerHTML = temp.replace(/OPENTAGINTEXT/g, "<").replace(/SLASHINTEXT/g, "/");
}

function saveText_AsXmlFile() {
    if (document.getElementById("content1").innerHTML == "") {
        alert('No File Selected');
        return false;
    }

    $("#spinner").show("slow", function () {
        //translateColor_ToTag();
        translateColor()
        var temp = document.getElementById("ptxaxml").innerHTML;
        temp = temp.replace(/OPENTAGINTEXT/g, "<").replace(/SLASHINTEXT/g, "/");
        //console.log(temp)
        document.getElementById("ptxaxml").innerHTML = temp;

        var xmlText = document.getElementById("ptxaxml").innerHTML;

        var textToWrite = xmlText.split('\n');
        //////////////////////////////////////////////////////////////////////////////
        var textToWrite2 = [];
        var rowFirstColumn = '';
        var allFirstColumns = '';
        start = '<ref>'
        suffix = '</ref>'
        other_start = '<oth>'
        other_suffix = '</oth>'
        
        for (var i = 0; i < textToWrite.length; i++) {
            // allFirstColumns needed for extracting references part (only references)
            rowFirstColumn = textToWrite[i];
            // add one space to the end of line if it is multi line ref and doesn't have hyphen or dash at end
            if (!(rowFirstColumn.substr(-suffix.length) === suffix) || (rowFirstColumn.substr(-other_suffix.length) === other_suffix))
                if (!(rowFirstColumn.substr(-'-'.length) === '-'))
                    if (!(rowFirstColumn.substr(-'.'.length) === '.'))
                        rowFirstColumn = rowFirstColumn + ' ';
            
            
            allFirstColumns = allFirstColumns + rowFirstColumn;
            // textToWrite2 is all layout with numbers
            if (i == textToWrite.length - 1) {
                // alert(cols2numbers[i]);
                // no \n for last line
                if (typeof cols2numbers[i] != 'undefined')
                    textToWrite2[i] = textToWrite[i] + cols2numbers[i];
                else
                    textToWrite2[i] = textToWrite[i] + '\n'
            }
            else
                textToWrite2[i] = textToWrite[i] + cols2numbers[i] + '\n';
        }
        // listOfRefs is splited by '<ref>'
        var listOfRefs = allFirstColumns.split(start);
        var j = 1;
        allrefs = ''
        for (var i = 0; i < listOfRefs.length; i++) {
            var ref = '';
            // first and last item in list are not reference so we dont need them
            if (j > 1 && j != listOfRefs.length) {
                ref = listOfRefs[i].replace(suffix, '') + '\n';
            }
            else if (j == listOfRefs.length) {
                ref = listOfRefs[i].split(suffix)[0];
            }
            // replasce html signs in references
            allrefs = allrefs + ref;
            j = j + 1;
        }
        ////////////////////////////////////////////////////////////////////////////////
        textToWrite2 = textToWrite2.join("");
        var textFileAsBlob = new Blob([textToWrite2], { type: 'text/plain' });
        //get file name
        var fullPath = document.getElementById('btnUploadbothfile').value;
        var filename = '';
        if (fullPath) {
            var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
            var filename = fullPath.substring(startIndex);
            if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
                filename = filename.substring(1).split('.')[0];
            }
        }
        var fileNameToSaveAs = textFileName.split('.')[0] + ".xml";

        textToWrite2 = textToWrite2.replace(/&amp;/g, "&").replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, '"').replace(/&pos;/g, "'").replace(/&nbsp;/g, " ");
        textToWrite2 = textToWrite2.replace(/OPENTAGINTEXT/g, "<").replace(/SLASHINTEXT/g, "/");
        download(textToWrite2.trim(), fileNameToSaveAs);
        // download(allrefs, fileNameToSaveAs);
        // save allrefs in a session and use them in next annotator tool 
        localStorage.setItem("allrefs", allrefs);
        $("#spinner").hide("slow");
    });
}

function download(data, filename) {
    var file = new Blob([data], { type: 'text/xml;charset=utf-8;' });
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);

        // var element = document.createElement('a');
        // element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
        // element.setAttribute('download', filename);
        // element.style.display = 'none';
        // document.body.appendChild(element);
        // element.click();
        // document.body.removeChild(element);
    }
}

function ReplaceAt(input, search, replace, start, end) {
    return input.slice(0, start)
        + input.slice(start, end).replace(search, replace)
        + input.slice(end);
}


function ChangeColor_TranslateColor(tag_name) {
	//check text 
	var coloredText = document.getElementById("content1").innerHTML;
	if (coloredText == "") {
		alert('Please Select a file');
		return;
	}
	//Get Selection Text 
	sel = window.getSelection();
	var selectedtext = sel.toString();
    var selectedtext2 = selectedtext.replace(/(\r\n|\n|\r)/gm, "<br>"); 
    // alert(selectedtext2);
    // alert(selectedtext2.split(' ').length);
    // alert(selectedtext.split(' ').length);
    if (tag_name == "ref_line") {
        if (selectedtext2.split(' ').length < 3) {
            alert('Please select more than 2 words!!');
            return;
        }
    }
    
    if (tag_name == "ref_part" || tag_name == "other") {
        if (selectedtext2.trim().split(' ').length < 1) {
            alert('Please select at least 1 word!!');
            return;
        }
    }
    
    if (tag_name == 'ref_line') {
        if (coloredText.includes(selectedtext2)) {

            var arr = coloredText.split(selectedtext2);
            var firstpart = arr.shift().split("<br>").pop()
            // alert(firstpart);
            var secondpart = arr.pop().split("<br>").shift()
            // alert(secondpart);
            var fulltext = firstpart + selectedtext2 + secondpart;

            if (firstpart != "" || secondpart != "") {
                //change color 
                if (colorCounter == 6) {
                    var fulltext2 = openSpanValue_arr[6] + fulltext + '</span>';
                    colorCounter = 0;
                } else {
                    var fulltext2 = openSpanValue_arr[colorCounter] + fulltext + '</span>';
                    colorCounter = colorCounter + 1;
                }
                // var fulltext2 = '<span style="background-color: rgb(236, 184, 249);">' + fulltext + '</span>';
                coloredText2 = coloredText.split(fulltext).shift() + fulltext2 + coloredText.split(fulltext).pop();
                document.getElementById("content1").innerHTML = coloredText2;
                }
            }
        }
    else {        
        var text11 = coloredText.substr(0, coloredText.lastIndexOf(sel));
        if (sel.rangeCount && sel.getRangeAt) {
            range = sel.getRangeAt(0);
        }  
        // Set design mode to on
        document.designMode = "on";
        if (range) {
            sel.removeAllRanges();
            sel.addRange(range);
        }
        tagname = tag_name
        if (tagname == "ref_line" || tagname == "ref_part") {
            document.execCommand("HiliteColor", false, spanColors_arr[colorCounter]);
           if (colorCounter == 6) { colorCounter = 0;}
            else{
                colorCounter = colorCounter +1
            }
        }
        else if (tagname == "other") {
            document.execCommand("HiliteColor", false, "#a2a5a5");
        }
        // Set design mode to off
        document.designMode = "off";
        // ?? why??
        var currentText = document.getElementById("content1").innerHTML;
        document.getElementById("content1").innerHTML = currentText;
        console.log(currentText);
        //translateColor();
    }
} 

function translateColor() {
	//replaces the manually added tags with colortags in lblColoredText. 
	//lblColoredText Contains <span tags>
	var arrayCopyOflblText = [];
	arrayCopyOflblText[currentLine] = document.getElementById("content1").innerHTML;
	var openSpanValue = "";
	var tagname = "";

	
    // iterate of spanColors array and translates spans to <ref< tags 
    openSpanValue_arr.forEach(function(item){

        openSpanValue = item;
        while (arrayCopyOflblText[currentLine].indexOf(openSpanValue) !== -1) {
            var t1 = arrayCopyOflblText[currentLine].substr(0, arrayCopyOflblText[currentLine].indexOf(openSpanValue));
            var t2 = arrayCopyOflblText[currentLine].substr(arrayCopyOflblText[currentLine].indexOf(openSpanValue), arrayCopyOflblText[currentLine].length).replace("</span>", "</ref>")
            arrayCopyOflblText[currentLine] = t1 + t2;
            arrayCopyOflblText[currentLine] = arrayCopyOflblText[currentLine].replace(openSpanValue, '<ref>');
        }
    }); 
    // translate other
	openSpanValue = '<span style="background-color: rgb(162, 165, 165);">';
	while (arrayCopyOflblText[currentLine].indexOf(openSpanValue) !== -1) {
		var text1 = arrayCopyOflblText[currentLine].substr(0, arrayCopyOflblText[currentLine].indexOf(openSpanValue));
		var text2 = arrayCopyOflblText[currentLine].substr(arrayCopyOflblText[currentLine].indexOf(openSpanValue), arrayCopyOflblText[currentLine].length).replace("</span>", "</oth>");
		arrayCopyOflblText[currentLine] = text1 + text2;
		arrayCopyOflblText[currentLine] = arrayCopyOflblText[currentLine].replace(openSpanValue, '<oth>');
	}
    current = arrayCopyOflblText[currentLine]
    var openTagValue = '<br>';
    var i = 0
    while (current.indexOf(openTagValue) !== -1) {
        i++;
        current = current.replace(openTagValue, '\n');
    }
    current = current.replace(/&amp;/g, "&").replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, '"').replace(/&pos;/g, "'").replace(/&nbsp;/g, " ");

    document.getElementById("ptxaxml").innerHTML = current;
    //var currentText = arrayOfLines[currentLine];
	//arrayCopyOflblText[currentLine] = currentText;
	//document.getElementById("ptxaxml").innerHTML = current;
}

function subfunction_translateColor(arrayCopyOflblText, openSpanValue, tagname)
{
	while (arrayCopyOflblText[currentLine].indexOf(openSpanValue) !== -1) {
		var t1 = arrayCopyOflblText[currentLine].substr(0, arrayCopyOflblText[currentLine].indexOf(openSpanValue));
		var t2 = arrayCopyOflblText[currentLine].substr(arrayCopyOflblText[currentLine].indexOf(openSpanValue), arrayCopyOflblText[currentLine].length).replace("</span>", "</"+tagname+">");
		arrayCopyOflblText[currentLine] = t1 + t2;
		arrayCopyOflblText[currentLine] = arrayCopyOflblText[currentLine].replace(openSpanValue, '<'+tagname+'>');
	}
	return arrayCopyOflblText;
}

function change_TxtColor(whole_line) {
    // change color for selected text in lable by execCommand
    // Get Selection
    var content1value = document.getElementById("content1").innerHTML;
    if (content1value == "") {
        alert('Please Select a file');
        return;
    } else
    {
        // remove all html code from text
        content1value = content1value.replace(/&amp;/g, "&").replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, '"').replace(/&pos;/g, "'").replace(/&nbsp;/g, " ");
        content1value = content1value.replace("<http", "&lt;http");
    }
    sel = window.getSelection();
    
    var selectedtext = sel.toString();
    if (selectedtext == "") {
        alert('Please Select Text');
        return;
    }
    // alert(selectedtext);
    
    var selectedtext2 = selectedtext.replace(/(\r\n|\n|\r)/gm, "<br>"); 
    // alert(selectedtext2);
    // alert(selectedtext2.split(' ').length);
    // alert(selectedtext.split(' ').length);
    if (whole_line) {
        if (selectedtext2.split(' ').length < 3) {
            alert('Please select more than 2 words!!');
            return;
        }
    }
    
    if (selectedtext2.indexOf('<http') > -1)
    {
        alert(selectedtext2);
        selectedtext2 = selectedtext2.replace("<http", "&lt;http");
    }
    if (content1value.includes(selectedtext2)) {
        if (whole_line) {
            var arr = content1value.split(selectedtext2);
            var firstpart = arr.shift().split("<br>").pop()
            // alert(firstpart);
            var secondpart = arr.pop().split("<br>").shift()
            // alert(secondpart);
            var fulltext = firstpart + selectedtext2 + secondpart;

            if (firstpart != "" || secondpart != "") {
                //change color 
                if (colorCounter == 6) {
                    var fulltext2 = openSpanValue_arr[6] + fulltext + '</span>';
                    colorCounter = 0;
                } else if (colorCounter == 5) {
                    var fulltext2 = openSpanValue_arr[5] + fulltext + '</span>';
                    colorCounter = colorCounter + 1;
                }
                else if (colorCounter == 4) {
                    var fulltext2 = openSpanValue_arr[4] + fulltext + '</span>';
                    colorCounter = colorCounter + 1;
                }
                else if (colorCounter == 3) {
                    var fulltext2 = openSpanValue_arr[3] + fulltext + '</span>';
                    colorCounter = colorCounter + 1;
                }
                else if (colorCounter == 2) {
                    var fulltext2 = openSpanValue_arr[2] + fulltext + '</span>';
                    colorCounter = colorCounter + 1;
                }
                else if (colorCounter == 1) {
                    var fulltext2 = openSpanValue_arr[1] + fulltext + '</span>';
                    colorCounter = colorCounter + 1;
                }
                else if (colorCounter == 0) {
                    var fulltext2 = openSpanValue_arr[0] + fulltext + '</span>';
                    colorCounter = colorCounter + 1;
                }
                // var fulltext2 = '<span style="background-color: rgb(236, 184, 249);">' + fulltext + '</span>';
                content1value2 = content1value.split(fulltext).shift() + fulltext2 + content1value.split(fulltext).pop();
                document.getElementById("content1").innerHTML = content1value2;
            }
            else
                change_color_bytriple();
        }
        else {
                var fulltext = selectedtext2
                if (colorCounter == 6) {
                    var fulltext2 = openSpanValue_arr[6] + fulltext + '</span>';
                    colorCounter = 0;
                } else if (colorCounter == 5) {
                    var fulltext2 = openSpanValue_arr[5] + fulltext + '</span>';
                    colorCounter = colorCounter + 1;
                }
                else if (colorCounter == 4) {
                    var fulltext2 = openSpanValue_arr[4] + fulltext + '</span>';
                    colorCounter = colorCounter + 1;
                }
                else if (colorCounter == 3) {
                    var fulltext2 = openSpanValue_arr[3] + fulltext + '</span>';
                    colorCounter = colorCounter + 1;
                }
                else if (colorCounter == 2) {
                    var fulltext2 = openSpanValue_arr[2] + fulltext + '</span>';
                    colorCounter = colorCounter + 1;
                }
                else if (colorCounter == 1) {
                    var fulltext2 = openSpanValue_arr[1] + fulltext + '</span>';
                    colorCounter = colorCounter + 1;
                }
                else if (colorCounter == 0) {
                    var fulltext2 = openSpanValue_arr[0] + fulltext + '</span>';
                    colorCounter = colorCounter + 1;
                }
                // var fulltext2 = '<span style="background-color: rgb(236, 184, 249);">' + fulltext + '</span>';
                var rng = sel.getRangeAt(0);
                
                //doc = document.getElementById("content1").innerHTML;
                var start_offset = rng['startOffset'];
                var end_offset = rng['endOffset'];
                
                content1value2 = content1value.slice(0,start_offset) + fulltext2 + content1value.slice(end_offset)
                //rng.deleteContents(selectedtext);
                //rng.insertNode(document.createElement(fulltext2));
                //document.getElementById("content1").innerHTML = ReplaceAt(doc, selectedtext, fulltext2, start_offset, end_offset);
                document.getElementById("content1").innerHTML = content1value2;
     
        }
    }
    else
        change_color_bytriple();
}


function change_color_bytriple() {
    //change color for selected text in lable by execCommand
    // Get Selection
    var content1value = document.getElementById("content1").innerHTML;
    if (content1value == "") {
        alert('Please Select a file');
        return;
    }

    sel = window.getSelection();
    var selectedtext = sel.toString();
    if (selectedtext == "") {
        alert('Please Select Text');
        return;
    }
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
    if (colorCounter == 6) {
        document.execCommand("HiliteColor", false, spanColors_arr[6]);
        colorCounter = 0;
    }
    else if (colorCounter == 5) {
        document.execCommand("HiliteColor", false, spanColors_arr[5]);
        colorCounter = colorCounter + 1;
    }
    else if (colorCounter == 4) {
        document.execCommand("HiliteColor", false, spanColors_arr[4]);
        colorCounter = colorCounter + 1;
    }
    else if (colorCounter == 3) {
        document.execCommand("HiliteColor", false, spanColors_arr[3]);
        colorCounter = colorCounter + 1;
    }
    else if (colorCounter == 2) {
        document.execCommand("HiliteColor", false, spanColors_arr[2]);
        colorCounter = colorCounter + 1;
    }
    else if (colorCounter == 1) {
        document.execCommand("HiliteColor", false, spanColors_arr[1]);
        colorCounter = colorCounter + 1;
    }
    else if (colorCounter == 0) {
        document.execCommand("HiliteColor", false, spanColors_arr[0]);
        colorCounter = colorCounter + 1;
    }
    // Set design mode to off
    document.designMode = "off";
    //translate color to tag will takes time because on \n. we omitted it
    /////////////////////////////////////////////////////////
    //var y = document.body.innerHTML; OK
    //var x = document.getElementsByTagName("BODY")[0].innerHTML;  OK

    // var iframe = document.getElementById('pdfiframe');
    // //alert(iframe.src);
    // var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    // if (iframeDocument) {
    //     var sss = iframeDocument.body.innerHTML;
    //     if (sss != "") {
    //         var eee = iframeDocument.getElementById('viewerContainer').innerHTML
    //     }
    // }

    //var iBody = $("pdfiframe").contents().find("body");
    //var iBodyhtml = iBody.html;
    //var myContent = iBody.find("viewerContainer");
    ////////////////////////////////////////////////////////////////////////////

}

function translateColor_ToTag() {
    // ptxaxml cant undrestand <span> tag and <br>
    // replaces the <span> tags with <ref> tag for ptxaxml.
    var textCopy = document.getElementById("content1").innerHTML;

    //var re = new RegExp(/<span style="background-color: rgb\(255, 150, 129\);"/g);
    while (textCopy.indexOf(openSpanValue_arr[0]) !== -1) {
        var text1 = textCopy.substr(0, textCopy.indexOf(openSpanValue_arr[0]));
        var text2 = textCopy.substr(textCopy.indexOf(openSpanValue_arr[0]), textCopy.length).replace("</span>", "</ref>");
        textCopy = text1 + text2;
        textCopy = textCopy.replace(openSpanValue_arr[0], '<ref>');
    }

    while (textCopy.indexOf(openSpanValue_arr[1]) !== -1) {
        var text1 = textCopy.substr(0, textCopy.indexOf(openSpanValue_arr[1]));
        var text2 = textCopy.substr(textCopy.indexOf(openSpanValue_arr[1]), textCopy.length).replace("</span>", "</ref>");
        textCopy = text1 + text2;
        textCopy = textCopy.replace(openSpanValue_arr[1], '<ref>');
    }
    while (textCopy.indexOf(openSpanValue_arr[2]) !== -1) {
        var text1 = textCopy.substr(0, textCopy.indexOf(openSpanValue_arr[2]));
        var text2 = textCopy.substr(textCopy.indexOf(openSpanValue_arr[2]), textCopy.length).replace("</span>", "</ref>");
        textCopy = text1 + text2;
        textCopy = textCopy.replace(openSpanValue_arr[2], '<ref>');
    }
    while (textCopy.indexOf(openSpanValue_arr[3]) !== -1) {
        var text1 = textCopy.substr(0, textCopy.indexOf(openSpanValue_arr[3]));
        var text2 = textCopy.substr(textCopy.indexOf(openSpanValue_arr[3]), textCopy.length).replace("</span>", "</ref>");
        textCopy = text1 + text2;
        textCopy = textCopy.replace(openSpanValue_arr[3], '<ref>');
    }
    while (textCopy.indexOf(openSpanValue_arr[4]) !== -1) {
        var text1 = textCopy.substr(0, textCopy.indexOf(openSpanValue_arr[4]));
        var text2 = textCopy.substr(textCopy.indexOf(openSpanValue_arr[4]), textCopy.length).replace("</span>", "</ref>");
        textCopy = text1 + text2;
        textCopy = textCopy.replace(openSpanValue_arr[4], '<ref>');
    }
    while (textCopy.indexOf(openSpanValue_arr[5]) !== -1) {
        var text1 = textCopy.substr(0, textCopy.indexOf(openSpanValue_arr[5]));
        var text2 = textCopy.substr(textCopy.indexOf(openSpanValue_arr[5]), textCopy.length).replace("</span>", "</ref>");
        textCopy = text1 + text2;
        textCopy = textCopy.replace(openSpanValue_arr[5], '<ref>');
    }
    while (textCopy.indexOf(openSpanValue_arr[6]) !== -1) {
        var text1 = textCopy.substr(0, textCopy.indexOf(openSpanValue_arr[6]));
        var text2 = textCopy.substr(textCopy.indexOf(openSpanValue_arr[6]), textCopy.length).replace("</span>", "</ref>");
        textCopy = text1 + text2;
        textCopy = textCopy.replace(openSpanValue_arr[6], '<ref>');
    }
    // ptxaxml cant undrestand <br> we should replace it with \n
    var openTagValue = '<br>';
    var i = 0
    while (textCopy.indexOf(openTagValue) !== -1) {
        i++;
        textCopy = textCopy.replace(openTagValue, '\n');
    }
    textCopy = textCopy.replace(/&amp;/g, "&").replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, '"').replace(/&pos;/g, "'").replace(/&nbsp;/g, " ");

    document.getElementById("ptxaxml").innerHTML = textCopy;
}

function RemoveTag() {
    sel = window.getSelection();
    if (sel == "") {
        alert('No Selection');
        return;
    }
    //alert(sel.anchorNode.parentElement.toString());
    if (sel.anchorNode.parentElement.toString() == "[object HTMLSpanElement]") {
        $(sel.anchorNode.parentElement).contents().unwrap();
        if (popUpFlag == true)
            document.getElementById("myPopup").classList.toggle("show");
        popUpFlag = false;
    }
    //alert(sel);
}

//tripleclick
window.addEventListener('click', function (evt) {
    if (evt.detail === 3) {
        sel = window.getSelection();
        newNode = document.createElement("p");
        range = sel.getRangeAt(0);

        if (range.endOffset != 0) {
            range.setEnd(range.endContainer, range.endOffset - 1);
        }
        else {
            range.setEnd(range.endContainer.previousSibling, range.endOffset);
        }
        change_color_bytriple();
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
    } else if ((sel = document.selection) && sel.type != "Control") {
        parentEl = sel.createRange().parentElement();
    }
    return parentEl;
}

$(document).click(function (event) {

    //alert(document.getElementsByClassName("popup").value);
    var popup = document.getElementById("myPopup");
    if (popUpFlag == true) {
        popup.classList.toggle("show");
        popUpFlag = false;

    }

});

$("#content1").click(function (event) {
    var popup = document.getElementById("myPopup");
    if (popUpFlag == true) {
        popup.classList.toggle("show");
        popUpFlag = false;
    }
});

$("#delbtnno").click(function (event) {
    //alert($("#popupdiv").is(':visible'))
    var popup = document.getElementById("myPopup");
    popup.classList.toggle("show");
    popUpFlag = false;
    //alert($("#popupdiv").is(':visible'));
});

$("#btntest").click(function (event) {
    document.getElementById("popupdiv").classList.add('popuphidden');
    alert($("#popupdiv").is(':visible'))

});

$("#pdfiframe").click(function (event) {
    document.getElementById("myPopup").classList.add('popuphidden'); // i read that this might be harmful to other functions
    alert("click on pdfiframe");
});

$("#content").mouseup(function () {

    var popup = document.getElementById("myPopup");

    sel = window.getSelection();
    if (sel != "") {
        if (sel.anchorNode.parentElement.toString() == "[object HTMLSpanElement]") {
            //alert(sel);
            $('#myPopup').css('left', event.pageX - 85); // -14 and -310 account for the top and left border(maybe there is an other way)
            $('#myPopup').css('top', event.pageY - 85);
            $('#myPopup').css('display', 'inline');
            $("#myPopup").css("position", "absolute");
            popup.classList.toggle("show");
            if (popUpFlag == false) {
                popUpFlag = true;
            }

        }
        else if (popUpFlag == true) {
            popup.classList.add('popuphidden');
            popUpFlag = false;
        }
        //alert("Mouse button released.");
    }
});

function callmyPopup() {
    var par = getSelectionParentElement().nodeName;
    var popup = document.getElementById("myPopup");

    if (par == "SPAN") {
        $('#myPopup').css('left', event.pageX - 85); // -14 and -310 account for the top and left border(maybe there is an other way)
        $('#myPopup').css('top', event.pageY - 85);
        $('#myPopup').css('display', 'inline');
        $("#myPopup").css("position", "absolute");
        popup.classList.toggle("show");
        if (popUpFlag == false) {
            popUpFlag = true;
        }
    }
    else if (popUpFlag == true) {
        popup.classList.toggle("show");
        popUpFlag = false;
    }
}

$("#content1").dblclick(function (event) {
    // sel = window.getSelection();
    //alert(sel);
    //range = sel.getRangeAt(0).cloneRange();
    //alert(range.startOffset + range.endOffset);
    //alert(range.startContainer + range.endContainer);
    //alert(range.extractContents());
    //alert(sel.anchorNode.parentElement.parentElement.toString());
    //alert(sel.anchorNode.parentElement.innerHTML)
    callmyPopup();
});


//////////////////////////////////

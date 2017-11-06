<html>
	<head>
		<link rel="stylesheet" href="style.css">
		<link href="css/bootstrap.min.css" rel="stylesheet">
		<title>GESIS Meta-data Extraction Tool</title>
		<script src="js/jquery-3.2.1.min.js"></script>
		<script type="text/javascript">
		</script>
	</head>

	<body>
        <div class="row textalignc" id="spinner" style="vertical-align: middle;">
           <!--<img src="images/page-loader.gif" > -->
        </div>
		<div class="container-fluid">
            <div class="popup" id="popupdiv">
                <span class="popuptext" id="myPopup">
                    <div class="row textalignc">
                        <div class="row textalignc">
                            Remove Tag?!
                        </div>
                        <div class="row textalignc">                    
                            <div class="col-md-12" >
                                <button style='background-color: #C0D4EE' id="delbtn" value="delbtn" class="btn btn-default noborderbtn text-wrap" type="button" onclick="RemoveTag(this);">Yes</button>                                       
                                <button style='background-color: #C0D4EE' id="delbtnno" value="delbtnno" class="btn btn-default noborderbtn text-wrap" type="button" onclick="">No</button>                   
                            </div>                    
                        </div>
                    </div>
                </span>
			</div>
			<div class="row">
                <div class="col-md-1" >
                    &nbsp;&nbsp; 
                </div>
                <div class="col-md-10">
                    
                </div>
                <div class="col-md-1" >
                    &nbsp;&nbsp; 
                </div>
			</div>
			<div class="row">
				<div class="col-md-1" >
					&nbsp;&nbsp;  
				</div>
				<div class="col-md-10">
                    <div class="panel panel-default" >
                        <div class="panel-body">
                            <!--<div class="row margin-bottom-5">
                                <div class="col-md-12" >
                                    <div class="material-switch ">
                                    &nbsp;  
                                        <label for="someSwitchOptionDefault" class="label-default"></label>
                                        <input id="someSwitchOptionDefault" name="someSwitchOption001" type="checkbox"/>
                                        &nbsp;  
                                    </div>
                                </div>
                                <div class="col-md-4" >
                                    Use Cermine to Tag References<br/><br/>
                                                                                                       
                                </div>
                                <div class="col-md-2" >
                                
                                </div>
                            </div>-->
                            <div class="row">
                                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-3 margin-bottom-5">
                                    <input type="checkbox" id="chbCermine" name="chbCermine" value="0" >Use Cermine to Tag
                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-3 margin-bottom-5">                                    
                                    <input type="file" accept=".txt, .xml"  id="uploadbtn" style="display: none;" name="ReferenceStringsFile" value="ReferenceStringsFile" onchange="checkfileType(this); "/>
                                    <input type="button" id="uploasfile" class="btn btn-primary" value="Select File ( txt/xml )" onclick="document.getElementById('uploadbtn').click();"  />                                    
                                </div>                                
                                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-2 margin-bottom-5" >                                    
                                    <button id="btnLoadSession" class="btn btn-primary">Load Last Session</button>
                                </div>                                
                                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-2 margin-bottom-5" >                                    
                                    <button class ="btn btn-primary" type="button" onclick="saveTextAsFile();">Export File as XML</button>
                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-2 margin-bottom-5" >                                    
                                    <button id="btnReload" class="btn btn-success " >Reload page</button>									
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-12">
                                    <label id="demo" class="fileName"></label>
                                </div>
                                <div class="col-md-12">
                                    <label id="lblerror" class="errorCls"></label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="panel panel-defaul hideclass" id="infoPanel">
                        <div class="panel-body">
                            <div class="row">
                                
                                
                            </div>
                        </div>
                    </div>
						
                    <!--<label id="ta1" class="textLabel">Please upload a File</label><!--note that ta1 isn't a textarea (anymore)-->
                    <!--<textarea id="ta1" cols="80" rows="5">Please upload a file</textarea>-->						
                    
                    <div class="panel panel-info"> 
                        <div class="panel-heading"> 
                            <h3 class="panel-title textalignl bold">Tag Reference String:&nbsp;&nbsp;<label class="fileName" id="demo"></label></h3> 
                        </div> 
                        <div class="panel-body"> 
                            <div class="row textalignc" >
                                <div class="row mrg-0 OriginalHeaderCls">
                                Original Refrence String
                                </div>
                                <div class="row mrg-0 textalignc">                                                                       
                                    <label id="contentForDemo" class="textLabel2 textalignl"></label>                                                                         
                                </div>
                                <div class="row mrg-0 OriginalHeaderCls">
                                    Annotated Refrence String
                                </div>
                                <div class="row mrg-0 textalignc">   
                                    <label id="content1" class="textLabel textalignl"></label> 
                                </div>
                                <div class="row mrg-0 textalignc pad-10 pad-lr-20">
                                    <div class="col-md-2 col-sm-6 col-xs-12">
                                        <div class="row textalignl pad-b-5">
                                            <button style='background-color: #ff9681; display: none;' id="test" value="test" class="btn btn-default noborderbtn" type="button" onclick="test(this);">test</button>											
                                            <button style='background-color: #ff9681' id="btnauthor" value="btnauthor" class="btn btn-default noborderbtn" type="button" onclick="ChangeColor_TranslateColor(this);">Author</button>
                                        </div>
                                        <div class="row textalignl pad-b-5">
                                            <button style='background-color: #fed88f' id="btneditor" value="btneditor" class="btn btn-default noborderbtn" type="button" onclick="ChangeColor_TranslateColor(this);">Editor</button>																								
                                        </div>
                                    </div>
                                    <div class="col-md-2 col-sm-6 col-xs-12">		
                                        
                                        <div class="row textalignl pad-b-5">
                                            <button style='background-color: #aabb30' id="btngiven-names" value="btngiven-names" class="btn btn-default noborderbtn" type="button" onclick="ChangeColor_TranslateColor(this);">First Name</button>
                                        </div>
                                        <div class="row textalignl pad-b-5">
                                            <button style='background-color: #ffce30' id="btnsurname" value="btnsurname" class="btn btn-default noborderbtn" type="button" onclick="ChangeColor_TranslateColor(this);">Surname</button>												
                                        </div>
                                    </div>
                                    <div class="col-md-2 col-sm-6 col-xs-12">
                                        
                                         <div class="row textalignl pad-b-5">
                                            <button style='background-color: #ffff66' id="btnvolume" value="btnvolume" class="btn btn-default noborderbtn" type="button" onclick="ChangeColor_TranslateColor(this);">volume</button>																								
                                        </div>
                                        <div class="row textalignl pad-b-5">
                                            <button style='background-color: #bfb1d5' id="btnyear" value="btnyear" class="btn btn-default noborderbtn" type="button" onclick="ChangeColor_TranslateColor(this);">Year</button>
                                        </div>
                                    </div>
                                    <div class="col-md-2 col-sm-6 col-xs-12">	
                                        
                                        <div class="row textalignl pad-b-5">
                                            <button style='background-color: #adddcf' id="btntitle" value="btntitle" class="btn btn-default noborderbtn" type="button" onclick="ChangeColor_TranslateColor(this);">Article Title</button>
                                        </div>
                                        <div class="row textalignl pad-b-5">
                                            <button style='background-color: #abe1fd' id="btnsource" value="btnsource" class="btn btn-default noborderbtn text-wrap" type="button" onclick="ChangeColor_TranslateColor(this);"><!--<p class="small mrg-0 "></p>-->source</button>												
                                        </div>
                                    </div>
                                    <div class="col-md-2 col-sm-6 col-xs-12">
                                        <div class="row textalignl pad-b-5">
                                            <button style='background-color: #ccff66' id="btnfpage" value="btnfpage" class="btn btn-default noborderbtn" type="button" onclick="ChangeColor_TranslateColor(this);">First Page</button>
                                        </div>
                                        <div class="row textalignl pad-b-5">
                                            <button style='background-color: #ffb3ff' id="btnlpage" value="btnlpage" class="btn btn-default noborderbtn" type="button" onclick="ChangeColor_TranslateColor(this);">Last Page</button>
                                        </div>
                                        
                                    </div>
                                    <div class="col-md-2 col-sm-6 col-xs-12">
                                        <div class="row textalignl pad-b-5">
                                            <button style='background-color: #f4858e' id="btnother" value="btnother" class="btn btn-default noborderbtn" type="button" onclick="ChangeColor_TranslateColor(this);">Others</button>
                                        </div>                                    
                                        <div class="row textalignl pad-b-5">
                                            <button style='background-color: #ffe1fd' id="delbtn" value="delbtn" class="btn btn-default noborderbtn text-wrap" type="button" onclick="RemoveTag(this);">Remove Tag</button>
                                        </div>
                                    </div>			
                                </div>
                            </div> 
                        </div> 
                    </div>
                    <div class="panel panel-info"> 
                        <div class="panel-heading"> 
                            <h3 class="panel-title textalignl bold">Preview Reference String with XML tags:</h3> 
                        </div> 
                        <div class="panel-body"> 
                            <div class="row textalignc" >										
                                <div class="row mrg-0 textalignc">
                                    <textarea disabled id="txaxml" class="txaxml" onkeyup="deletechar(event);" onkeydown="preventDeleteChar(event);"></textarea>
                                </div>
                                <div class="row mrg-0">
                                    <br/>									
                                    <div class="col-md-12">
                                        <div class="col-md-2">
                                            &nbsp;&nbsp; 
                                        </div>
                                        <div class="col-md-8">
                                            <div class="margin-bottom-10" style="display: inline-block !important;">
                                                <button type="button" id="btnfirst" class="btn btn-primary" onclick="gotofirstLine();">First</button>&nbsp; 
                                            </div>
                                            <div class="margin-bottom-10" style="display: inline-block !important;">
                                                <button type="button" id="prev" class="btn btn-primary" onclick="gotoprevLine();">Prev</button>&nbsp; 
                                            </div>
                                            <div  class="margin-bottom-10" style="display: inline-block !important;">
                                                <label class="btn btn-default btn-sm" id="count" style="font-weight: bold;"> 0/0 </label>&nbsp; 
                                            </div>
                                            <div class="margin-bottom-10" style="display: inline-block !important;">
                                                <button type="button" id="next" class="btn btn-primary" onclick="gotonextLine();">Next</button>&nbsp; 
                                            </div>
                                            <div  class="margin-bottom-10"style="display: inline-block !important;">
                                                <button type="button" id="btnlast" class="btn btn-primary" onclick="gotolastLine();">Last</button>
                                            </div>
                                        </div>
                                        <div class="col-md-2">
                                            &nbsp;&nbsp; 
                                        </div>
                                    </div>																						
                                </div>

                                <div class="row">
                                    
                                    <!--<textarea id="tatest" cols="80" rows="30">Please upload a file</textarea>-->
                                </div>
                             </div> 
                        </div>																			
                    </div>
                    <!--<textarea id="tatest" cols="80" rows="30">Please upload a file</textarea>-->
				</div>
				<div class="col-md-1">
					&nbsp;&nbsp; 
				</div>
			</div>
		
		
		</div>
		<script src="js/bootstrap.min.js"></script>
		<script type="text/javascript" src="scripts.js"></script>
		

	</body>
</html>
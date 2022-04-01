/**
    * @name LWP
    * @version 0.0.2	
    * @description Test
    * @author Lycaon
    * @source https://github.com/Lycraon/Lycraons-Walltaker-BBD-plugin
    * @updateUrl https://raw.githubusercontent.com/Lycraon/Lycraons-Walltaker-BBD-plugin/main/LWP.plugin.js
    */
	
	

//const config for Plugin info
const config = {
	info: {
		name: "Lycaons Walltaker (BBD-)Plugin",
		authors: [
	 		{
               		name: "Lycaon"
            		}
        	],
        	version: "0.0.2",
        	description: "Sets your BBD Background as an e621 post from your Walltaker link"
    	},
	//To-Do: show changelog on first load
    	changelog: [
        	{
			title: "Fixes",
			type: "fixed",
			items: [
				"nothing"
			]
        	}
    ],
    defaultConfig: []
};


//Settings for [plugin].config.json with default values
var settings = {
		"linkID": "",
		"interval": "15000",
		"primaryBG": "rgba(0,0,0,0.05)",
		"secondaryBG": "rgba(0,0,0,0.4)",
		"tertiaryBG": "rgba(0,0,0,0)",
		"titleBG": "rgba(0,0,0,0.9)",
		"chatheaderBG": "rgba(0,0,0,0.7)",
		"sidebarBG": "rgba(0,0,0,0.9)",
		"messageBG": "rgba(0,0,0,0.1)",
		"bgFit": "auto 100vh"
	}

//const base id for style element in header
const cssID = "LWP_css";

//last url from JSON
var lastUrl = "";

//save settings into [plugin].config.json
function saveSettings(){
	
	BdApi.saveData(config.info.name, "settings", settings);
}

//load settings into [plugin].config.json
function loadSettings(){
	
	var tmp = BdApi.loadData(config.info.name,"settings");
	if(tmp) settings = tmp;
}


//request .json from url
function getJSON(url,callback) {
  let xhr = new XMLHttpRequest();
  xhr.onload = function () {
    callback(this.responseText)
  };
  xhr.open("GET", url, true);
  xhr.setRequestHeader("User-Agent", "Lycaons BBD plugin");
  xhr.send();
}


//get .json conten in usable format
function getUsefulContents(url,callback) {
  getJSON( url, data => callback(JSON.parse(data)));
}

//Get update from url(to .json) 
// and update stylesheet(2)
function updateJSON(){
	var url = "https://walltaker.joi.how/links/" + settings.linkID + ".json";
	
	getUsefulContents(url, data => {
		
		//Update stylesheet(2)
		updateStyleSheet(data);
	
	});
	
	if(settings.interval>999){
		setTimeout(updateJSON,settings.interval);
	}
}

//Update stylesheet(2)
function updateStyleSheet(data){	

		//check if data recieved and if post changed
		if(data && lastUrl != data.post_url){ 

			//set last Url
			lastUrl=data.post_url
			
			//Change background
			var inner = "";
			inner += "body{";

			inner += 	"background-Image: url('"+data.post_url+"');";
			
			inner += "}";	
			document.getElementById(cssID + "_1").innerHTML = inner;
		}	
}

//delete all instances of 1st stylesheet
function deleteCSS1(){
	while(document.getElementById(cssID)){
		document.getElementById(cssID).remove();
	}
	
}

//delete all instances of 2nd stylesheet
function deleteCSS2(){
	while(document.getElementById(cssID + "_1")){
			document.getElementById(cssID+ "_1").remove();
		}
}

//create stylesheet(1)/css for
function createCSS(){
	
	var inner = "";
	
	
	//:root
	 inner += ":root{";
	 inner += 	"--background-secondary:"+settings["secondaryBG"]+";";
	 inner += 	"--background-primary:  "+settings["primaryBG"]+";";
	 
	 inner += 	"--background-tertiary: "+settings["tertiaryBG"]+";";
	 inner += "}";


	 //body
	 inner += "body{"
	 
	 inner +=	"width: 100%;"
	 inner +=	"height: 100%;"
	 inner +=	"background-repeat: no-repeat;"
	 inner += 	"background-position: center center;"
	 inner += 	"background-size: "+settings["bgFit"]+";"
	 inner +="}"
	 
	//titlebar of Discord window
	 inner += ".titleBar-1it3bQ {";
	 inner += 	"margin-top: 0;";
	 inner += 	"padding-top: 0.8em;";
	 inner += 	"background: "+settings["titleBG"]+";";
	 inner += "}";

	 //content of titlebar of Discord window
	 inner += ".titleBar-1it3bQ > * {";
	 inner += 	"top: -0.4em;";
	 inner += "}";
	 
	 //titlebar of chat
	 inner += ".container-ZMc96U.themed-Hp1KC_ {";
	 inner += 	"background: "+settings["chatheaderBG"]+";";
	 inner += "}";
	 
	 //sidebar
	 inner += ".scroller-3X7KbA {";
	 inner += 	"background: "+settings["sidebarBG"]+";";
	 inner += "}";
	
	//messages
	 inner += ".messageListItem-ZZ7v6g {";
	 inner += 	"background: "+settings["messageBG"]+";";
	 inner += 	"padding-top: 0.5em;";
	 inner += 	"padding-bottom: 0.5em;";
	 inner += 	"border-bottom: 0.1em solid rgba(0,0,0,0.5);";
	 inner += 	"box-shadow: 0 0.1em 0.4em rgba(0,0,0,0.48);";
	 inner += "}";
	 
	//channels in sidebar
	 inner += ".content-1gYQeQ {";
	 inner += "border-radius: 0;";
	 inner += "marginRight: 0;";
	 inner += "width: 100%;";
	 inner += 	"border-bottom: 0.1em solid black;";
	 inner += 	"box-shadow: 0 0.25em 0.4em rgba(0,0,0,0.48);";
	 inner += "}";
	 
	 document.getElementById(cssID).innerHTML = inner;
}

//--------------------------------------------------------------

module.exports = class LWP{
	


getName(){
	
	return config["info"]["name"];
}

getDescription(){
	
	return config["info"]["description"];
}

getVersion(){
	return config["info"]["version"];
}

getAuthor(){
	var tmp_str = ""
	var array = config["info"]["authors"]
	array.forEach( function callback(author,index) {
		
		tmp_str += author["name"];
		if(index < array.length -1 )
			tmp_str += ","
	});
	
	
	return tmp_str;
}

start(){
	//remove old css in case stop() was not called on exit
	deleteCSS1();
	deleteCSS2();
	
	//load Saved Data
	loadSettings();
	
	//create new Stylesheet(s)
	var style = document.createElement('style');
	style.id = cssID;
	style.type = 'text/css';
	document.head.appendChild(style);
	
	var style2 = document.createElement('style');
	style2.id = cssID + "_1";
	style2.type = 'text/css';
	document.head.appendChild(style2);
	
	//create const stylesheet/css
	createCSS();
	
	//start checks / .json updates
	updateJSON();
}


//When Openin Settings in plugins in tab
getSettingsPanel(){

	let tmp = document.createElement("div");
	tmp.id = "settingsPage2";
	tmp.innerHTML = ""
	
	var label = document.createElement("p");
	label.innerHTML="Link ID:";
	label.style.color = "white";
	tmp.appendChild(label);
	
	
	
	var in_linkID = document.createElement("input");
	in_linkID.type =  "text";
	in_linkID.value = settings.linkID;
	in_linkID.addEventListener("change",function() {
		if(this.value && this.value != " ")
		settings.linkID = this.value
		saveSettings();
	});
	
	tmp.appendChild(in_linkID);
	
	var label = document.createElement("p");
	label.innerHTML="Interval (sec.):";
	label.style.color = "white";
	tmp.appendChild(label);
	
	

	
	var in_interv = document.createElement("input");
	in_interv.type =  "number";
	in_interv.value = settings.interval/1000;
	in_interv.addEventListener("change",function() {
		
		var n = parseInt(this.value);
		if(n>=1)
		settings.interval = n*1000;
		
		saveSettings();
	});
	tmp.appendChild(in_interv);
	
	var label = document.createElement("p");
	label.innerHTML="Image-Fit:";
	label.style.color = "white";
	tmp.appendChild(label);

	var in_fit = document.createElement("select");

	in_fit.appendChild(new Option("cover", "cover"));
	in_fit.appendChild(new Option("contain", "contain"));
	in_fit.appendChild(new Option("fill height", "auto 100vh"));
	in_fit.appendChild(new Option("fill width", "100vw auto"));
	in_fit.appendChild(new Option("stretch", "100vw 100vh"));
	in_fit.appendChild(new Option("auto", "auto auto"));
	in_fit.appendChild(new Option("none", "none"));
	
	in_fit.value = settings.bgFit;
	
	in_fit.addEventListener("change",function() {
		
		settings.bgFit = this.value;
		
		createCSS();
		saveSettings();
	});
	tmp.appendChild(in_fit);
	
	return tmp;
}


stop(){
	//reset lastUrl 
	//(remove this if last picture should load on next start before new post is found)
	lastUrl = ""
	
	//remove stylesheet(s)
	deleteCSS1();
	deleteCSS2();
}
	
}

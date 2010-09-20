var tabs = require("tabs");
var self = require("self");

const {Cc, Ci} = require("chrome");

var HTML_NS = 'http://www.w3.org/1999/xhtml';
//from tombloo 01_utility.js
function capture(tab, src, pos, dim, scale){
  var document = tab.contentDocument.wrappedJSObject;
	pos = pos || {x:0, y:0};
	
	// デフォルトではAppShellService.hiddenDOMWindowが使われる
	var canvas = document.createElementNS(HTML_NS, 'canvas');
	var ctx = canvas.getContext('2d');
	canvas.width = dim.w;
	canvas.height = dim.h;
	
	if(scale){
		scale	= scale.w? scale.w/dim.w : 
			scale.h? scale.h/dim.h : scale;
		
		canvas.width = dim.w * scale;
		canvas.height = dim.h * scale;
		ctx.scale(scale, scale);
	}
	
	if(src instanceof Ci.nsIDOMHTMLImageElement){
		ctx.drawImage(src, pos.x, pos.y);
	} else {
		ctx.drawWindow(src, pos.x, pos.y, dim.w, dim.h, '#FFF');
	}
	
	return canvas.toDataURL('image/png', '');
}
Dimensions = function(w,h){
  this.w = w;
  this.h = h;
};
function getViewDimensions(tab){
	var d = new Dimensions();
//	var doc = currentDocument();
  var doc = tab.contentDocument.wrappedJSObject;

	if(doc.compatMode == 'CSS1Compat'){
		d.h = doc.documentElement.clientHeight;
		d.w = doc.documentElement.clientWidth;
	} else {
		d.h = doc.body.clientHeight;
		d.w = doc.body.clientWidth;
	}
	
	return d;
}

function writeScreenShot(tab){
  var doc = tab.contentDocument.wrappedJSObject;
  console.log(doc);
  var url = Cc["@mozilla.org/network/standard-url;1"].createInstance(Ci.nsIURL);
  url.spec = tab.thumbnail.toDataURL();
//  url.spec = capture(doc.getElementById("canvas").getContext("2d").window,
//  url.spec = capture(tab, doc.createElementNS(HTML_NS, 'canvas').getContext("2d").window,
//                     {x:0, y:0}, getViewDimensions(tab));
  

  var file = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile);
  file.initWithPath("/tmp/"+(new Date).getTime()+".png");
  
  var wbp = Cc["@mozilla.org/embedding/browser/nsWebBrowserPersist;1"].createInstance(Ci.nsIWebBrowserPersist);
  wbp.saveURI(url, null, null, null, null, file);
}

tabs.onActivate = function(tab){
  console.log("onActivate: "+tab.title + ":" + tab.location.href);
  writeScreenShot(tab);
};

tabs.onDeactivate = function(tab){
  console.log("onDeactivate: "+tab.title + ":" + tab.location.href);
};

tabs.onOpen = function(tab){
  console.log("onOpen: "+tab.title + ":" + tab.location.href);
};

tabs.onClose = function(tab){
  console.log("onClose: "+tab.title + ":" + tab.location.href);
};

//tabs.onReady = function(tab){
//  console.log("onReady: "+tab.title + ":" + tab.location.href);
//};
// 
//tabs.onLoad = function(tab){
//  console.log("onLoad: "+tab.title + ":" + tab.location.href);
//};
// 
//tabs.onPaint = function(tab){
//  console.log("onPaint: "+tab.title + ":" + tab.location.href);
//};


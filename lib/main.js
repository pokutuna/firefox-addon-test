var tabs = require("tabs");
var file = require("file");
var url = require("url");
var streams = require("byte-streams");
const {Cc} = require("chrome");


var dataDir = packaging.getURLForData("/");

function getScreenShot(tab){
  var now = (new Date()).getTime();
  console.log(now);
  var filename = dataDir+now+".png";
  console.log(filename);
  file.mkpath(filename);
  var stream = file.open(dataDir+filename+".png", "r");
  stream.write(tab.thumbnail.toDataURL());
  stream.close();
}

function writeScreenShot(url){
  const IO_SERVICE = Cc['@mozilla.org/network/io-service;1'].getService(Components.interfaces.nsIIOService);
  url = IO_SERVICE.newURI(url, null, null);

  var wbp = Cc['@mozilla.org/embedding/browser/nsWebBrowserPersist;1'].createInstance(Components.interfaces.nsIWebBrowserPersist);
  wbp.saveURI(url, null, null, null, null, dataDir+"screenshot.png");
}

tabs.onActivate = function(tab){
  console.log("onActivate: "+tab.title + ":" + tab.location.href);
  getScreenShot(tab);
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


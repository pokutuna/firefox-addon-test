var tabs = require("tabs");
var self = require("self");
const {Cc, Ci} = require("chrome");


//var dataDir = packaging.getURLForData("/");
// 
//function getScreenShot(tab){
//  var now = (new Date()).getTime();
//  console.log(now);
//  var filename = dataDir+now+".png";
//  console.log(filename);
//  file.mkpath(filename);
//  var stream = file.open(dataDir+filename+".png", "r");
//  stream.write(tab.thumbnail.toDataURL());
//  stream.close();
//}

function writeScreenShot(tab){
  var url = Cc["@mozilla.org/network/standard-url;1"].createInstance(Ci.nsIURL);
  url.spec = tab.thumbnail.toDataURL();

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


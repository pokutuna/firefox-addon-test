var tabs = require("tabs");
var self = require("self");
var prefs = require("preferences-service");
const {Cc, Ci} = require("chrome");

prefs.set("path","/tmp/");
//prefs.set("path","C:\\UIST\\");


function writeScreenShot(tab){
  var time = (new Date).getTime();
  var doc = tab.contentDocument.wrappedJSObject;
  console.log(doc);
  var url = Cc["@mozilla.org/network/standard-url;1"].createInstance(Ci.nsIURL);
  url.spec = tab.thumbnail.toDataURL();

  var snapshot = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile);
  snapshot.initWithPath(prefs.get("path")+time+".png");
  var wbp = Cc["@mozilla.org/embedding/browser/nsWebBrowserPersist;1"].createInstance(Ci.nsIWebBrowserPersist);
  wbp.saveURI(url, null, null, null, null, snapshot);

  var href = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile);
  href.initWithPath(prefs.get("path")+time+".txt");
  var foStream = Cc["@mozilla.org/network/file-output-stream;1"]
    .createInstance(Ci.nsIFileOutputStream);
  foStream.init(href, 0x02 | 0x08 | 0x20, 0664, 0); // write, create, truncate
  foStream.write(tab.location.href, tab.location.href.length);
  foStream.close();
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
  writeScreenShot(tab);
};

tabs.onClose = function(tab){
  console.log("onClose: "+tab.title + ":" + tab.location.href);
  writeScreenShot(tab);
};

tabs.onReady = function(tab){
  console.log("onReady: "+tab.title + ":" + tab.location.href);
  writeScreenShot(tab);
};
// 
//tabs.onLoad = function(tab){
//  console.log("onLoad: "+tab.title + ":" + tab.location.href);
//};
// 
//tabs.onPaint = function(tab){
//  console.log("onPaint: "+tab.title + ":" + tab.location.href);
//};


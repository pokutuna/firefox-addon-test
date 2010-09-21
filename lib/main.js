var tabs = require("tabs");
var self = require("self");
var prefs = require("preferences-service");
const {Cc, Ci} = require("chrome");

prefs.set("path","/tmp/");

function setPathByOS(){
    // Windows Vista, XP, 2000, NT では "WINNT" が返る。
    // GNU/Linux では "Linux" 。Mac OS X では "Darwin" が返る。
    var osString = Cc["@mozilla.org/xre/app-info;1"]
        .getService(Ci.nsIXULRuntime).OS;
    if(osString == "WINNT") prefs.set("path","C:\\UIST\\");
    else prefs.set("path","/tmp/");
}

function writeScreenShot(tab){
  if(tab.location.href == "about:blank") return;
  var time = (new Date).getTime();

  var wbp = Cc["@mozilla.org/embedding/browser/nsWebBrowserPersist;1"].createInstance(Ci.nsIWebBrowserPersist);
    
  var snapshot_url = Cc["@mozilla.org/network/standard-url;1"].createInstance(Ci.nsIURL);
  snapshot_url.spec = tab.thumbnail.toDataURL();
  var snapshot = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile);
  snapshot.initWithPath(prefs.get("path")+time+".png");
  wbp.saveURI(snapshot_url, null, null, null, null, snapshot);
  
  var href = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile);
  href.initWithPath(prefs.get("path")+time+".txt");
  var foStream = Cc["@mozilla.org/network/file-output-stream;1"]
    .createInstance(Ci.nsIFileOutputStream);
  foStream.init(href, 0x02 | 0x08 | 0x20, 0664, 0); // write, create, truncate
  foStream.write(tab.location.href, tab.location.href.length);
  foStream.close();
  
  wbp = Cc["@mozilla.org/embedding/browser/nsWebBrowserPersist;1"].createInstance(Ci.nsIWebBrowserPersist);  
  var favicon_url = Cc["@mozilla.org/network/standard-url;1"].createInstance(Ci.nsIURL);
  favicon_url.spec = tab.favicon;
  var favicon = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile);
  favicon.initWithPath(prefs.get("path")+time+"_favicon.png");
  wbp.saveURI(favicon_url, null, null, null, null, favicon);
}



setPathByOS();
var prevTab = tabs.activeTab;

    
tabs.onActivate = function(tab){
  console.log("prevTab in onActivate: "+prevTab.title);
  console.log("onActivate: "+tab.title + ":" + tab.location.href);
  writeScreenShot(tab);
  prevTab = tabs.activeTab;
};

tabs.onDeactivate = function(tab){
  console.log("prevTab in onDeactivate: "+prevTab.title);
  console.log("onDeactivate: "+tab.title + ":" + tab.location.href);
  writeScreenShot(prevTab);
  prevTab = tabs.activeTab;
};

//tabs.onOpen = function(tab){
//  console.log("prevTab in onOpen: "+prevTab.title);    
//  console.log("onOpen: "+tab.title + ":" + tab.location.href);
//  writeScreenShot(tab);
//  prevTab = tabs.activeTab;
//};

//tabs.onClose = function(tab){
//  console.log("prevTab in onClose: "+prevTab.title);
//  console.log("onClose: "+tab.title + ":" + tab.location.href);
//  writeScreenShot(prevTab);
//  prevTab = tabs.activeTab;
//};

tabs.onReady = function(tab){
  console.log("prevTab in onReady: "+prevTab.title);    
  console.log("onReady: "+tab.title + ":" + tab.location.href);
  writeScreenShot(tab);
  prevTab = tabs.activeTab;  
};
// 
//tabs.onLoad = function(tab){
//  console.log("onLoad: "+tab.title + ":" + tab.location.href);
//};
// 
//tabs.onPaint = function(tab){
//  console.log("onPaint: "+tab.title + ":" + tab.location.href);
//};


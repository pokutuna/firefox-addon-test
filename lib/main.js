var tabs = require("tabs");


tabs.onActivate = function(tab){
  console.log("onActivate: "+tab.title + ":" + tab.location.href);
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


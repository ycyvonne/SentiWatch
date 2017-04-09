chrome.browserAction.onClicked.addListener(function(tab) {
  // chrome.tabs.executeScript( {file: "d3/d3.v4.min.js" });
  // chrome.tabs.executeScript( {file: "popup_graph.js" });
  // Send a message to the active tab
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
  });
});

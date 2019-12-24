
var ACTIVE_TAG=-1;

  chrome.runtime.onMessage.addListener(
   async function(request, sender, sendResponse) {
        console.log("background.js got a message")
       
        return true;
               
    }
);
chrome.runtime.onInstalled.addListener(function() {
    var title = "Shorten link copy";
    var id = chrome.contextMenus.create({"title": title, "contexts":["link","selection"],
                                           "id": "shorten_link_selection"}); 

  });
  // add click event
chrome.contextMenus.onClicked.addListener(onClickHandler);
chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete') {
  
        initUser()
        //document.append("quang")
    }
  })
  chrome.tabs.onActivated.addListener(function(tabId, changeInfo, tab) {
    chrome.tabs.get(tabId.tabId, function(tab){
        ACTIVE_TAG=tabId.tabId;
    });
});
chrome.browserAction.onClicked.addListener(function(tab) { alert('icon clicked')});
// The onClicked callback function.
function onClickHandler(info, tab) {
  var sText = info.selectionText;
  if(!sText)
        sText=info.linkUrl;
  if(!sText|| !isValidUrl(sText))
    return;
  createShorten(sText).then((link)=>{
      copyTextToClipboard(link.shorten);
      showMsg("Copied shoreten link");

  })
 
};
function showMsg(msg){
    alert(msg);
}
async function initUser(){

    let response= await fetch(`${BASE_API_URL}?ext=true`);
    let text=await  response.text();  
    return text;


}

async function  createShorten(link){
    const response = await fetch(`${BASE_API_URL}generate-link`, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *client
        body: JSON.stringify({link:link}) // body data type must match "Content-Type" header
      });
      return await response.json();
    
}
function isValidUrl(text){
    var expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
var regex = new RegExp(expression);
return text.match(regex);
}


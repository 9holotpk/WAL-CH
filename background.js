// DEV. EXTENTION BY 9holotpk
var whatsAppURL = "https://web.whatsapp.com/";
var readTitle;
var tabID;
var res = "";
var status = ''; // 'contact' default
chrome.browserAction.setBadgeText({ text: "" });

function checkQR (what){
	chrome.tabs.query({ url: whatsAppURL + "*" }, function(tabs){
		chrome.tabs.sendMessage(tabs[0].id, {line: 'countparas'});
		// console.log('sendMessage * ' + tabs[0].id);
	});
	// console.log('CHK: QR = ' + what);
	checkBadge();
	chrome.runtime.onMessage.addListener(
		function (request, sender) {
			// console.log('runtime', request.count);
			if(request.count == 'Scan me!'){
				// console.log('log: (' +request.count+ ') tab ID: (' +sender.tab.id+ ') Waiting Scan QR Code.');
				setBadgeQR();
			} else {
				setBadgeQR();
			}
		}
	);
}

function checkBadge() {
	chrome.tabs.query({ url: whatsAppURL + "*", status: 'complete' }, function(tabs){
		if(tabs.length > 0){
			tabID = tabs[0].id;
			// # Load options saved.
			chrome.storage.local.get("favoriteBadge", function(items) {
				if (!chrome.runtime.lastError) {
					status = items.favoriteBadge;
				}
			});
			// # Read Title.				
			readTitle = tabs[0].title;
			// # Check status by options.
			if (status == 'none') {
				chrome.browserAction.setBadgeText({ text: "" });
				chrome.browserAction.setTitle({title: 'WhatsApp Launcher'})
			} else {
				var f = readTitle.indexOf("(");
				var e = readTitle.indexOf(")");
				res = readTitle.substring(f+1, e);
				if(res.length > 0){
					chrome.browserAction.setTitle({title: 'Chat from ' +res+ ' contact(s) | Click to Launch'})
					chrome.browserAction.setBadgeText({ text: res });
					chrome.browserAction.setBadgeBackgroundColor({ color: "#ff0000" });
				}else{
					chrome.browserAction.setTitle({title: 'WhatsApp Launcher'})
					chrome.browserAction.setBadgeText({ text: "on" });
					chrome.browserAction.setBadgeBackgroundColor({ color: "#000000" });
				}
			}
		}
	});
}

function setBadgeQR() {
	chrome.browserAction.setBadgeText({ text: "QR" });
	chrome.browserAction.setTitle({ title: 'Please Scan QR Code' })
	chrome.browserAction.setBadgeBackgroundColor({ color: "#000000" });
}

function setBadgeOn() {
	chrome.browserAction.setTitle({title: 'WhatsApp Launcher'})
	chrome.browserAction.setBadgeText({ text: "on" });
	chrome.browserAction.setBadgeBackgroundColor({ color: "#000000" });
}

chrome.browserAction.onClicked.addListener(function(){
	// # Check WhatsApp tab.
	chrome.tabs.query({ url: whatsAppURL + "*" }, function(tabs){
        if(tabs.length > 0){
        	var winID = tabs[0].windowId;
    		chrome.windows.update(winID, { focused: true });   		
            tabID = tabs[0].id;
            checkQR('by Click');
        }else{
			// # Create new window chat.
        	chrome.windows.create({url: whatsAppURL, type: "popup", width: 685, height: 620, top: 50, left: 50});
			checkQR('by Click');
        }
    });	
});

chrome.tabs.onActivated.addListener(function (activeInfo){
	// console.log('log: onActive');
	if(activeInfo.tabId == tabID){
		checkQR('by Active');
	}
});

chrome.tabs.onUpdated.addListener(function(tabsU, changeInfo, tab){
	checkQR('by Update');
});

chrome.tabs.onRemoved.addListener(function (tabsR, removeInfo){
	if(tabsR==tabID){
		chrome.browserAction.setBadgeText({ text: "" });
		chrome.browserAction.setTitle({title: 'WhatsApp Launcher'});
	}
});

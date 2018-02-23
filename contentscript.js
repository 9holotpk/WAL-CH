// DEV. EXTENTION BY 9holotpk
chrome.runtime.onMessage.addListener(
	function(request, sender){
		if(request.line=='countparas'){
			var paras = 0;
			var paras = document.body.querySelectorAll('img');
            var icon = document.getElementById('favicon').href;
			if(paras != undefined && paras.length > 0){ 
				let index = 0;
				for( index=0; index < paras.length; index++ ) {
					theCount = paras[index].alt;
					if (paras[index].alt == 'Scan me!') {
						chrome.runtime.sendMessage({count:theCount});
					}
				}
			} else if (paras != undefined && paras.length == 0){
				if (paras.alt == 'Scan me!') {
					chrome.runtime.sendMessage({count:paras.alt});
				} else {
					chrome.runtime.sendMessage({count:0});
				}
			} else{
				chrome.runtime.sendMessage({count:0});
				// console.log('log: There does not seem to be any <div> elements in this page!');
			}
		}
});
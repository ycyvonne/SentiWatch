/*
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
      var firstHref = $("a[href^='http']").eq(0).attr("href");

      console.log(firstHref);
    }
  }
);*/

/*
(function (chrome) {

    var js = document.createElement('script');
    js.type = 'text/javascript';
    js.src = chrome.extension.getURL('inject.js');
    document.getElementsByTagName('head')[0].appendChild(js);

    var js2 = document.createElement('script');
    js2.type = 'text/javascript';
    js2.src = chrome.extension.getURL('jquery-3.2.0.min.js');
    document.getElementsByTagName('head')[0].appendChild(js2);

}(chrome));*/

var sentence = '';
var currentSentence = '';

$('input').each(function(index){
	var elem = $(this);
	// Save current value of element
	elem.data('oldVal', elem.val());

	// Look for changes in the value
	elem.bind("propertychange change click keyup input paste", function(event){

		// If value has changed...
		if (elem.data('oldVal') != elem.val()) {

			// Updated stored value
			elem.data('oldVal', elem.val());

			// Do action
			updateSentence(elem.val(), '.');
		}
   });

});

function updateSentence(val, delim){
	var index = val.lastIndexOf(delim);

	var secondlastIndex = index != -1
							? val.substr(0, val.length - 1).lastIndexOf(delim)
							: -1;

	currentSentence = '';

	if(val.substr(val.length - 1) == delim){

		if(secondlastIndex != -1)
			currentSentence = val.substr(secondlastIndex + 1);
		else
			currentSentence = val;

		console.log('currentSentence', currentSentence)
		sentence += currentSentence + ' ';
		
		//make api request
		console.log('sentence: ' + sentence);

		currentSentence = '';
	}
}


chrome.storage.sync.set({'value': 'fvgbhj'}, function() {
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (key in changes) {
      var storageChange = changes[key];
      console.log('Storage key "%s" in namespace "%s" changed. ' +
                  'Old value was "%s", new value is "%s".',
                  key,
                  namespace,
                  storageChange.oldValue,
                  storageChange.newValue);
    }
});

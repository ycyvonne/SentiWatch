/*
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
      var firstHref = $("a[href^='http']").eq(0).attr("href");

      console.log(firstHref);
    }
  }
);*/

console.log('hi')
var sentence = '';
var currentSentence = '';
var runningInput = '';

var currentId = 1;

var params = {
    // Request parameters
};


var allData = {
  data: [] //{time: '', text: '', sentiment: '', keywords: ''}
};

document.addEventListener(
  'keypress',
  function (ev) {
  	if(ev.key.length == 1)
   		runningInput += ev.key;
   	if(!updateSentence(runningInput, '.', false)){
      if(!updateSentence(runningInput, '!', false)){
        updateSentence(runningInput, '?', false);
      }
    }
  },
  true
);

document.onkeypress = function(e){
    if (!e) e = window.event;
    var keyCode = e.keyCode || e.which;
    if (keyCode == '13'){
      // Enter pressed
      updateSentence(runningInput, '.', true);
      return false;
    }
}

function updateSentence(val, delim, override){
	var index = val.lastIndexOf(delim);

	var secondlastIndex = index != -1
							? val.substr(0, val.length - 1).lastIndexOf(delim)
							: -1;

	currentSentence = '';

	if(val.substr(val.length - 1) == delim || override){

		if(secondlastIndex != -1)
			currentSentence = val.substr(secondlastIndex + 1);
		else
			currentSentence = val;

		console.log('currentSentence', currentSentence)
		sentence += currentSentence + ' ';

    getSentiment(currentSentence, setStorage);

		currentSentence = '';

    return true;

	}

  return false;
}

function getSentiment(currentSentence, callback){

  var data = {
    documents: [{id: currentId++, text: currentSentence}]
  };

  var dataJSON = JSON.stringify(data);

  $.ajax({
      url: "https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment?" + $.param(params),
      beforeSend: function(xhrObj){
          // Request headers
          xhrObj.setRequestHeader("Content-Type","application/json");
          xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","5cd0b00a05ad44e4a3fbdd36c673bf4b");
      },
      type: "POST",
      // Request body
      data: dataJSON,
  })
  .done(function(data) {
      getKeyWords(currentSentence, callback, data);
  });
}

function getKeyWords(currentSentence, callback, dataSoFar){
  var data = {
    documents: [{id: currentId, text: currentSentence}]
  };

  var dataJSON = JSON.stringify(data);

  $.ajax({
      url: "https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/keyPhrases?" + $.param(params),
      beforeSend: function(xhrObj){
          // Request headers
          xhrObj.setRequestHeader("Content-Type","application/json");
          xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","5cd0b00a05ad44e4a3fbdd36c673bf4b");
      },
      type: "POST",
      // Request body
      data: dataJSON,
  })
  .done(function(data) {
    var keyPhrases = data.documents[0].keyPhrases;
    callback(currentSentence, keyPhrases, dataSoFar);
  });

}

$('body').append('<div class="notification-wrapper" style="pointer-events: none; position: absolute; width: 100%; height: 100%"></div>');

function appendNotification(happy, score){

  if($('.notification-wrapper') == null)
    $('body').append('<div class="notification-wrapper" style="pointer-events: none; position: absolute; width: 100%; height: 100%"></div>');

  var content = '<div id="DS-icon" style="opacity: 0;z-index: 10000000; text-align: center; font-size: 30px; right: 10px; top: 25px; position: fixed; padding: 20px; color: white; border-radius: 5px; background: ';
  content += happy ? '#53b6f1; ">☺</div>' : '#da5c5c; ">☹</div>';
  console.log('appending...')
  $('.notification-wrapper').append(content);

  $('#DS-icon').animate({top: '10px', opacity: 1}, 200);

  setTimeout(function(){
    $('#DS-icon').animate({top: '25px', opacity: 0}, 200, function(){
      setTimeout(function(){$('.notification-wrapper').html('');}, 200);
    });
  }, 2000);
}

function setStorage(currentSentence, keyPhrases, data){
  var scoreRaw = data.documents[0].score;
  var positive = scoreRaw > 0.5;
  var score = positive ? scoreRaw : 1 - scoreRaw; //0 to 1

  chrome.storage.sync.get('notifications', function(notif){
    if(notif.notifications == 'T')
      appendNotification(positive, score);
  });
  
  var d = new Date(); // for now

  var week  = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  var currentObject = {
    id: data.documents[0].id,
    text: currentSentence,
    isPositive: positive,
    score: {
      raw: scoreRaw,
      absolute: score
    },
    keyPhrases: keyPhrases,
    time: {
      year: d.getFullYear(),
      month: {
        number: d.getMonth(),
        text: month[d.getMonth()]
      },
      day: 10,
      weekDay: {
        number: d.getDay(), //0-6
        text: week[d.getDay()] //sun -> saturday
      },
      hours: d.getHours(),
      minutes: d.getMinutes(),
      seconds: d.getSeconds() 
    }
  }

  chrome.storage.sync.get('data', function(data) {

    allData = data.data.trim().length != 0 ? JSON.parse(data.data) : {data: []};
    allData.data.push(currentObject);
    chrome.storage.sync.set({'data': JSON.stringify(allData)}, function() {
    });
//    console.log('[content.js] current data stored: ', allData);

  });
  
}

//reset for now
//chrome.storage.sync.set({'data': ''}, function() {
//});


chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (key in changes) {
      var storageChange = changes[key];
    /*  console.log('Storage key "%s" in namespace "%s" changed. ' +
                  'Old value was "%s", new value is "%s".',
                  key,
                  namespace,
                  storageChange.oldValue,
                  storageChange.newValue);*/
    }
});



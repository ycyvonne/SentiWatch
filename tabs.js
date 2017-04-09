function openTab(evt) {
    var tabName = evt.currentTarget.getAttribute('id').replace('Open','');
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

var loadHandler=function() {
  // Get the element with id="defaultOpen" and click on it
  document.getElementById("CurrentOpen").addEventListener('click',openTab);
  document.getElementById("HistoryOpen").addEventListener('click',openTab);
  document.getElementById("SettingsOpen").addEventListener('click',openTab);
}

window.addEventListener('load', loadHandler);

document.addEventListener('click', function(){
     console.log('clicked')
    chrome.storage.sync.get('data', function(data) {

        allData = data.data.trim().length != 0 ? JSON.parse(data.data) : {data: []};

        console.log('[tabs.js] current data stored: ', allData);

    });
})


var date = new Date();
var hour = date.getHours();


var xArr = ['x'];

for(var i = 0; i < 6; i++){
    xArr.push(hour - (5 - i));
}

loadChartData();

function loadChartData(){
  console.log('loading');
  chrome.storage.sync.get('data', function(data) {
    parseData(JSON.parse(data.data));
  });
}

function parseData(data){
  console.log('json data', data.data)
  var compiledData = [];

  for(var i = 0; i < data.data.length; i++)
  {
    var curObj = data.data[i];
    if(curObj.time.year == date.getFullYear()
        && curObj.time.month.number == date.getMonth()
        && ((curObj.time.hours <= date.getHours() || 24 - curObj.time.hours + date.getHours() < 6)
            && (curObj.time.hours > date.getHours() - 6) || 24 + curObj.time.hours - date.getHours() < 6))
    {
        compiledData.push({
          hour: curObj.time.hours,
          value: curObj.score.absolute * 100
        });
    }
  }
  console.log('compiled data')
  loadChart(compiledData);
}

var positive = 140;
var negative = 110;

$('.header').click(function(){
    positive += 10;
})

var chart = c3.generate({
    bindto: '#dailychart',
    data: {
        x: 'x',
        columns: [
            xArr,
            ['negative', 30, 40, 60, 120, 150, negative],
            ['positive', 40, 60, 30, 60, 80, positive]
        ],
        types: {
            negative: 'area-spline',
            positive: 'area-spline'
        },
         colors: {
           negative: '#da5c5c',
           positive: '#53b6f1'
         }
    },
    axis: {
        y: {
            label: { // ADD
              text: 'Sentiment Score',
              position: 'outer-middle'
            }
          }
    }
});

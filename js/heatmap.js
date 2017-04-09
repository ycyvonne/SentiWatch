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

var LAST_NUM_WEEKS = 5;

document.querySelector('.tab').addEventListener('click', clearMap);
document.querySelector('#HistoryOpen').addEventListener('click', loadHeatMapData);

function clearMap(){
  console.log('clearing...')
  document.querySelector('#heatmapchart').innerHTML = '';
}

function loadHeatMapData(){
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
    compiledData.push({
      weekDay: curObj.time.day,
      week: curObj.time.weekDay.number + 1,
      value: curObj.score.absolute * 100
    });
  }
  loadHeatMap(compiledData);
}

function loadHeatMap(data){

  var data = [
  {week: 1, weekDay: 1, value: 16},
  {week: 2, weekDay: 1, value: 0},
  {week: 3, weekDay: 1, value: 46},
  {week: 4, weekDay: 1, value: 66},
  {week: 5, weekDay: 1, value: 100},
  {week: 6, weekDay: 1, value: 16},
  {week: 7, weekDay: 1, value: 30},
  {week: 1, weekDay: 2, value: 11},
  {week: 2, weekDay: 2, value: 50},
  {week: 3, weekDay: 2, value: 30},
  {week: 4, weekDay: 2, value: 20},
  {week: 5, weekDay: 2, value: 10},
  {week: 6, weekDay: 2, value: 5},
  {week: 7, weekDay: 2, value: 20},
  {week: 1, weekDay: 2, value: 30},
  {week: 1, weekDay: 3, value: 40},
]

console.log('data', data)

var margin = { top: 50, right: 0, bottom: 100, left: 30 },
    width = 1200 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom,
    gridSize = Math.floor(width / 24),
    legendElementWidth = gridSize*2,
    buckets = 9,
    colors = ["#1b91d7","#53b6f1","#56b4ee","#6fa3d2","#8e8fb0","#b0798b","#b0798b","#cc656c",'#da5c5c'], // alternatively colorbrewer.YlGnBu[9]
    weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    weeksOld = ["", "2 wks ago", "1 wk ago", "Now"];

    weeks = weeksOld.slice(Math.max(weeksOld.length - LAST_NUM_WEEKS, 1));

var svg = d3.select("#heatmapchart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var dayLabels = svg.selectAll(".dayLabel")
    .data(weeks)
    .enter().append("text")
      .text(function (d) { return d; })
      .attr("x", 0)
      .attr("y", function (d, i) { return i * gridSize; })
      .style("text-anchor", "end")
      .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
      .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });

var timeLabels = svg.selectAll(".timeLabel")
    .data(weekDays)
    .enter().append("text")
      .text(function(d) { return d; })
      .attr("x", function(d, i) { return i * gridSize; })
      .attr("y", 0)
      .style("text-anchor", "middle")
      .attr("transform", "translate(" + gridSize / 2 + ", -6)")
      .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });

var colorScale = d3.scale.quantile()
    .domain([0, buckets - 1, d3.max(data, function (d) { return d.value; })])
    .range(colors);

var cards = svg.selectAll(".hour")
    .data(data, function(d) {return d.week+':'+d.weekDay;});

cards.append("title");

//console.log('weeks offset', weeksOffset)
cards.enter().append("rect")
    .attr("x", function(d) { return (d.week - 1) * gridSize; })
    .attr("y", function(d) { return (d.weekDay - 1) * gridSize; })
    .attr("class", "hour bordered")
    .attr("width", gridSize)
    .attr("height", gridSize)
    .style("fill", colors[0]);

cards.transition().duration(300)
    .style("fill", function(d) { return colorScale(d.value); });

cards.select("title").text(function(d) { return d.value; });

cards.exit().remove();
}

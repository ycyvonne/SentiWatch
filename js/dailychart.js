var date = new Date();
var hour = date.getHours();


var xArr = ['x'];

for(var i = 0; i < 6; i++){
    xArr.push(hour - (5 - i));
}

var chart = c3.generate({
    bindto: '#dailychart',
    data: {
        x: 'x',
        columns: [
            xArr,
            ['positive', 300, 350, 300, 10, 20, 70],
            ['negative', 130, 100, 140, 200, 150, 50]
        ],
        types: {
            positive: 'area-spline',
            negative: 'area-spline'
        },
         colors: {
           positive: '#53b6f1',
           negative: '#da5c5c'
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

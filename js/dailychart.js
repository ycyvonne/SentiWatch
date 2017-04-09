var chart = c3.generate({
    bindto: '#dailychart',
    data: {
        columns: [
            ['positive', 300, 350, 300, 0, 0, 0],
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
    }
});

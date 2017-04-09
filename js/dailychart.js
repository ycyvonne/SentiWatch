var chart = c3.generate({
    bindto: '#dailychart',
    data: {
        columns: [
            ['data1', 300, 350, 300, 0, 0, 0],
            ['data2', 130, 100, 140, 200, 150, 50]
        ],
        types: {
            data1: 'area-spline',
            data2: 'area-spline'
        },
         colors: {
           data1: 'hotpink',
           data2: 'pink'
         }
    }
});

Ext.define("States.view.Gender", {
    extend: 'Ext.chart.CartesianChart',
    config: {
        animate: false,
        shadow: false,
        store: "PyramidStore",
        title: 'Gender Distribution',
        legend: {
            position: 'bottom',
            verticalWidth: 80,
            horizontalHeight: 37
        },
        flipXY: true,
        insetPadding: {
            left: 25,
            top: 25,
            bottom: 0
        },
        series: [
            {
                type: 'pyramid',
                xField: 'name',
                y1Field: 'female',
                y2Field: 'male',
                style: {
                    stroke: '#333',
                    minGapWidth: 1
                }
            }
        ],
        axes: [
            {
                type: 'numeric',
                position: 'bottom',
                title: {
                    text: 'Age Distribution',
                    fontSize: 18
                },
                renderer: function (v) {
                    return Math.abs(v / 1000).toFixed(1) + 'K';
                }
            },
            {
                type: 'category',
                position: 'right',
                style: {
                    estStepSize: 1,
                    stroke: 'none'
                },
                labelInSpan: true,
                label: {
                    fontSize: 10
                }
            }
        ]
    }
});
Ext.define("States.view.Race", {
    extend: 'Ext.chart.PolarChart',
    requires: ['Ext.chart.series.Pie'],
    config: {
        animate: false,
        shadow: false,
        store: "PieStore",
        title: 'Race Distribution',
        innerPadding: 40,
        interactions: [
            'rotate'
        ],
        series: [
            {
                type: 'pie',
                donut: 15,
                xField: 'value',
                labelField: 'name',
                colors: ['rgb(8, 69, 148)',
                         'rgb(33, 113, 181)',
                         'rgb(66, 146, 198)',
                         'rgb(107, 174, 214)',
                         'rgb(158, 202, 225)',
                         'rgb(198, 219, 239)',
                         'rgb(222, 235, 247)'],
                label: {
                    font: '10px Helvetica',
                    contrast: true
                }
            }
        ]
    }
});
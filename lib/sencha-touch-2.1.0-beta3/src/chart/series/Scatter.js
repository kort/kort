/**
 * @class Ext.chart.series.Scatter
 * @extends Ext.chart.series.Cartesian
 *
 * Creates a Scatter Chart. The scatter plot is useful when trying to display more than two variables in the same visualization.
 * These variables can be mapped into x, y coordinates and also to an element's radius/size, color, etc.
 * As with all other series, the Scatter Series must be appended in the *series* Chart array configuration. See the Chart
 * documentation for more information on creating charts. A typical configuration object for the scatter could be:
 *
 * {@img Ext.chart.series.Scatter/Ext.chart.series.Scatter.png Ext.chart.series.Scatter chart series}
 *
 *     var store = new Ext.data.JsonStore({
 *         fields: ['name', 'data1', 'data2', 'data3', 'data4', 'data5'],
 *         data: [
 *             {'name':'metric one', 'data1':10, 'data2':12, 'data3':14, 'data4':8, 'data5':13},
 *             {'name':'metric two', 'data1':7, 'data2':8, 'data3':16, 'data4':10, 'data5':3},
 *             {'name':'metric three', 'data1':5, 'data2':2, 'data3':14, 'data4':12, 'data5':7},
 *             {'name':'metric four', 'data1':2, 'data2':14, 'data3':6, 'data4':1, 'data5':23},
 *             {'name':'metric five', 'data1':27, 'data2':38, 'data3':36, 'data4':13, 'data5':33}
 *         ]
 *     });
 *
 *     new Ext.chart.AbstractChart({
 *         renderTo: Ext.getBody(),
 *         width: 500,
 *         height: 300,
 *         animate: true,
 *         theme:'Category2',
 *         store: store,
 *         axes: [{
 *             type: 'Numeric',
 *             position: 'bottom',
 *             fields: ['data1', 'data2', 'data3'],
 *             title: 'Sample Values',
 *             grid: true,
 *             minimum: 0
 *         }, {
 *             type: 'Category',
 *             position: 'left',
 *             fields: ['name'],
 *             title: 'Sample Metrics'
 *         }],
 *         series: [{
 *             type: 'scatter',
 *             markerConfig: {
 *                 radius: 5,
 *                 size: 5
 *             },
 *             axis: 'left',
 *             xField: 'name',
 *             yField: 'data2'
 *         }, {
 *             type: 'scatter',
 *             markerConfig: {
 *                 radius: 5,
 *                 size: 5
 *             },
 *             axis: 'left',
 *             xField: 'name',
 *             yField: 'data3'
 *         }]
 *     });
 *
 * In this configuration we add three different categories of scatter series. Each of them is bound to a different field of the same data store,
 * `data1`, `data2` and `data3` respectively. All x-fields for the series must be the same field, in this case `name`.
 * Each scatter series has a different styling configuration for markers, specified by the `markerConfig` object. Finally we set the left axis as
 * axis to show the current values of the elements.
 *
 */
Ext.define('Ext.chart.series.Scatter', {

    extend: 'Ext.chart.series.Cartesian',

    uses: ['Ext.chart.Shape'],

    alias: 'series.scatter',
    
    type: 'scatter',
    seriesType: 'scatterSeries',

    requires: [
        'Ext.chart.series.sprite.Scatter'
    ],
    
    config: {
        /**
         * @cfg {Boolean} showMarkers
         * Whether markers should be displayed at the data points along the line. If true,
         * then the {@link #markerConfig} config item will determine the markers' styling.
         */
        showMarkers: true,

        /**
         * @cfg {Object} markerConfig
         * The display style for the markers. Only used if {@link #showMarkers} is true.
         * The markerConfig is a configuration object containing the same set of properties defined in
         * the Sprite class. For example, if we were to set red circles as markers to the line series we could
         * pass the object:
         *
         <pre><code>
         markerConfig: {
             type: 'circle',
             radius: 4,
             'fill': '#f00'
         }
         </code></pre>

         */
        markerConfig: {}
    }
});


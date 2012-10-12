/**
 * @class Ext.chart.axis.Numeric
 * @extends Ext.chart.axis.Axis
 *
 * An axis to handle numeric values. This axis is used for quantitative data as
 * opposed to the category axis. You can set minimum and maximum values to the
 * axis so that the values are bound to that. If no values are set, then the
 * scale will auto-adjust to the values.
 *
 * {@img Ext.chart.axis.Numeric/Ext.chart.axis.Numeric.png Ext.chart.axis.Numeric chart axis}
 *
 * For example:
 *
 *     var store = new Ext.data.JsonStore({
 *          fields: ['name', 'data1', 'data2', 'data3', 'data4', 'data5'],
 *          data: [
 *              {'name':'metric one', 'data1':10, 'data2':12, 'data3':14, 'data4':8, 'data5':13},
 *              {'name':'metric two', 'data1':7, 'data2':8, 'data3':16, 'data4':10, 'data5':3},
 *              {'name':'metric three', 'data1':5, 'data2':2, 'data3':14, 'data4':12, 'data5':7},
 *              {'name':'metric four', 'data1':2, 'data2':14, 'data3':6, 'data4':1, 'data5':23},
 *              {'name':'metric five', 'data1':27, 'data2':38, 'data3':36, 'data4':13, 'data5':33}
 *          ]
 *     });
 *
 *     new Ext.chart.AbstractChart({
 *         renderTo: Ext.getBody(),
 *         width: 500,
 *         height: 300,
 *         store: store,
 *         axes: [{
 *             type: 'Numeric',
 *             grid: true,
 *             position: 'left',
 *             fields: ['data1', 'data2', 'data3', 'data4', 'data5'],
 *             title: 'Sample Values',
 *             grid: {
 *                 odd: {
 *                     opacity: 1,
 *                     fill: '#ddd',
 *                     stroke: '#bbb',
 *                     'lineWidth': 1
 *                 }
 *             },
 *             minimum: 0,
 *             adjustMinimumByMajorUnit: 0
 *         }, {
 *             type: 'Category',
 *             position: 'bottom',
 *             fields: ['name'],
 *             title: 'Sample Metrics',
 *             grid: true,
 *             label: {
 *                 rotate: {
 *                     degrees: 315
 *                 }
 *             }
 *         }],
 *         series: [{
 *             type: 'area',
 *             highlight: false,
 *             axis: 'left',
 *             xField: 'name',
 *             yField: ['data1', 'data2', 'data3', 'data4', 'data5'],
 *             style: {
 *                 opacity: 0.93
 *             }
 *         }]
 *     });
 *
 * In this example we create an axis of Numeric type. We set a minimum value so that
 * even if all series have values greater than zero, the grid starts at zero. We bind
 * the axis onto the left part of the surface by setting _position_ to _left_.
 * We bind three different store fields to this axis by setting _fields_ to an array.
 * We set the title of the axis to _Number of Hits_ by using the _title_ property.
 * We use a _grid_ configuration to set odd background rows to a certain style and even rows
 * to be transparent/ignored.
 *
 * @constructor
 */
Ext.define('Ext.chart.axis.Numeric', {
    extend: 'Ext.chart.axis.Axis',
    alias: 'axis.numeric',
    type: 'numeric',
    requires: ['Ext.chart.axis.layout.Continuous', 'Ext.chart.axis.segmenter.Numeric'],
    config: {

        /**
         * @cfg {Boolean} roundToDecimal
         * Whether to round the result to the given decimals.
         * If `true` then the decimals config will determine the number of decimals to round the
         * number to.
         */
        roundToDecimal: false,

        /**
         * @cfg {Number} decimals
         * The number of decimals to round the value to.
         */
        decimals: 2,

        /**
         * @cfg {String} scale
         * The scaling algorithm to use on this axis. May be "linear" or
         * "logarithmic".
         */
        scale: "linear",

        /**
         * @cfg {String} position
         */
        position: 'left',

        /**
         * @cfg {Boolean} adjustMaximumByMajorUnit
         * Indicates whether to extend maximum beyond data's maximum to the nearest
         * `majorUnit`.
         */
        adjustMaximumByMajorUnit: false,

        /**
         * @cfg {Boolean} adjustMinimumByMajorUnit
         * Indicates whether to extend the minimum beyond data's minimum to the
         * nearest `majorUnit`.
         */
        adjustMinimumByMajorUnit: false,

        layout: 'continuous',

        segmenter: 'numeric',
        
        aggregator: 'double'
    }
});

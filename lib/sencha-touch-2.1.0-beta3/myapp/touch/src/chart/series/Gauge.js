/**
 * @class Ext.chart.series.Gauge
 * @extends Ext.chart.series.Series
 *
 * Creates a Gauge Chart. Gauge Charts are used to show progress in a certain variable. There are two ways of using the Gauge chart.
 * One is setting a store element into the Gauge and selecting the field to be used from that store. Another one is instantiating the
 * visualization and using the `setValue` method to adjust the value you want.
 *
 * A chart/series configuration for the Gauge visualization could look like this:
 *
 *     {
 *         xtype: 'chart',
 *         store: store,
 *         axes: [{
 *             type: 'gauge',
 *             position: 'gauge',
 *             minimum: 0,
 *             maximum: 100,
 *             steps: 10,
 *             margin: -10
 *         }],
 *         series: [{
 *             type: 'gauge',
 *             angleField: 'data1',
 *             donut: false,
 *             colorSet: ['#F49D10', '#ddd']
 *         }]
 *     }
 *
 * In this configuration we create a special Gauge axis to be used with the gauge visualization (describing half-circle markers), and also we're
 * setting a maximum, minimum and steps configuration options into the axis. The Gauge series configuration contains the store field to be bound to
 * the visual display and the color set to be used with the visualization.
 */
Ext.define('Ext.chart.series.Gauge', {

    extend: 'Ext.chart.series.Series',
    type: "gauge",
    requires: [
        'Ext.draw.sprite.Sector'
    ],

    rad: Math.PI / 180,

    config: {
        /**
         * @cfg {String} angleField (required)
         * The store record field name to be used for the gauge angles.
         * The values bound to this field name must be positive real numbers.
         */
        angleField: false,

        /**
         * @cfg {Boolean} needle
         * Use the Gauge Series as an area series or add a needle to it.
         */
        needle: false,

        /**
         * @cfg {Boolean/Number} donut
         * Use the entire disk or just a fraction of it for the gauge.
         */
        donut: false,

        /**
         * @cfg {Boolean} showInLegend
         * Whether to add the gauge chart elements as legend items.
         */
        showInLegend: false,

        /**
         * @cfg {Object} style
         * An object containing styles for overriding series styles from Theming.
         */

        minimum: 0,

        maximum: 100
    }
});


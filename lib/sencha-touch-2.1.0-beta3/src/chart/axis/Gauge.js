/**
 * @class Ext.chart.axis.Gauge
 * @extends Ext.chart.axis.Abstract
 *
 * Gauge Axis is the axis to be used with a Gauge series. The Gauge axis
 * displays numeric data from an interval defined by the `minimum`, `maximum` and
 * `step` configuration properties. The placement of the numeric data can be changed
 * by altering the `margin` option that is set to `10` by default.
 *
 * A possible configuration for this axis would look like:
 *
 *     axes: [{
 *         type: 'gauge',
 *         position: 'gauge',
 *         minimum: 0,
 *         maximum: 100,
 *         steps: 10,
 *         margin: 7
 *     }],
 */
Ext.define('Ext.chart.axis.Gauge', {

    extend: 'Ext.chart.axis.Abstract',

    config: {
        /**
         * @cfg {Number} minimum (required) the minimum value of the interval to be displayed in the axis.
         */
        minimum: NaN,
        /**
         * @cfg {Number} maximum (required) the maximum value of the interval to be displayed in the axis.
         */
        maximum: NaN,
        /**
         * @cfg {Number} steps (optional) the number of steps and tick marks to add to the interval.
         */
        steps: 10,
        /**
         * @cfg {Number} margin (optional) the offset positioning of the tick marks and labels in pixels.
         */
        margin: 10,
        /**
         * @cfg {String} position
         * Where to set the axis. Available options are `left`, `bottom`, `right`, `top`. Default's `bottom`.
         */
        position: 'gauge',
        /**
         * @cfg {String} title
         * The title for the Axis
         */
        title: false
    },

    applyPosition: function () { return 'gauge'; }
});

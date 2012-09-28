/**
 * @class Ext.chart.axis.Radial
 * @extends Ext.chart.axis.Abstract
 *
 * Radial Axis is the axis to be used with a Radar Series. The Radial axis
 * is a circular display of numerical data by steps, with the number of circles
 * equivalent to the defined number of `steps`. Given the maximum data value,
 * the axis will compute step values depending on the number of defined `steps`.
 *
 * A possible configuration for this axis would look like:
 *
 *      axes: [{
 *          steps: 5,
 *          type: 'Radial',
 *          position: 'radial',
 *          label: {
 *              display: 'none'
 *          }
 *      }]
 */
Ext.define('Ext.chart.axis.Radial', {

    extend: 'Ext.chart.axis.Abstract',

    config: {
        /**
         * @cfg {Number} maximum (optional) the maximum value to be displayed in the axis.
         */
        maximum: false,

        /**
         * @cfg {Number} steps (required) the number of steps to add to the radial axis.
         */
        step: 10,

        position: 'radial',

        /**
         * @cfg {Number} rotation
         * The angle in degrees at which the first pie slice should start.
         */
        rotation: 0
    }

});

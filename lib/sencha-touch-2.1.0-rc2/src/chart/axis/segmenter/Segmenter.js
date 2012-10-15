/**
 * @class Ext.chart.axis.segmenter.Segmenter
 * 
 * Interface for the type of data used in an Axis.
 */
Ext.define("Ext.chart.axis.segmenter.Segmenter", {

    config: {
        /**
         * @cfg {Ext.chart.axis.Axis} axis The axis that the Segmenter is bound.
         */
        axis: null
    },

    constructor: function (config) {
        this.initConfig(config);
    },

    from: function (value) {
        return value;
    },

    /**
     * Returns the difference between the min and max value based on the given unit scale.
     * 
     * @param min the smaller value
     * @param max the larger value
     * @param unit the unit scale
     */
    diff: function (min, max, unit) {

    },

    align: function (value, step, unit) {

    },


    add: function (value, step, unit) {

    },

    preferredStep: function (min, estStepSize) {

    }
});
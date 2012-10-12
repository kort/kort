Ext.define("Ext.chart.axis.segmenter.Names", {
    extend: 'Ext.chart.axis.segmenter.Segmenter',
    alias: 'segmenter.names',

    renderer: function (value, context) {
        return value;
    },

    diff: function (min, max, unit) {
        return Math.floor(max - min);
    },

    align: function (value, step, unit) {
        return Math.floor(value);
    },


    add: function (value, step, unit) {
        return value + step;
    },

    preferredStep: function (min, estStepSize, minIdx, data) {
        return {
            unit: 1,
            step: 1
        };
    }
});
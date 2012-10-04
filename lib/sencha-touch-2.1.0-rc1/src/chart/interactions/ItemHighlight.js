/**
 *
 */
Ext.define('Ext.chart.interactions.ItemHighlight', {

    extend: 'Ext.chart.interactions.Abstract',

    type: 'itemhighlight',
    alias: 'interaction.itemhighlight',

    config: {
        /**
         * @cfg {String} gesture
         * Defines the gesture type that should trigger the item info panel to be displayed.
         */
        gesture: 'tap'
    },

    getGestures: function () {
        var gestures = {};
        gestures.itemtap = 'onGesture';
        gestures.tap = 'onFailedGesture';
        return gestures;
    },

    onGesture: function (series, item, e) {
        e.highlightItem = item;
    },

    onFailedGesture: function (e) {
        this.getChart().setHighlightItem(e.highlightItem || null);
        this.sync();
    }
});

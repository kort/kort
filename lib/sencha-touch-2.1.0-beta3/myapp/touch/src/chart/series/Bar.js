/**
 * TODO: Finish documentation
 *
 */
Ext.define('Ext.chart.series.Bar', {

    extend: 'Ext.chart.series.StackedCartesian',

    alias: 'series.bar',
    type: 'bar',
    seriesType: 'barSeries',

    requires: ['Ext.chart.series.sprite.Bar'],

    config: {
        highlightCfg: {
            lineWidth: 3,
            stroke: '#55c',
            opacity: 0.8,
            color: '#f00'
        }
    },

    getSprites: function () {
        var sprites = this.callSuper(arguments),
            attrs = {}, i, ln = sprites.length;

        if (this.getStacked()) {
            attrs.groupCount = 1;
            attrs.groupOffset = 0;
            for (i = 0; i < ln; i++) {
                sprites[i].setAttributes(attrs);
            }
        } else {
            attrs.groupCount = this.getYField().length;
            for (i = 0; i < ln; i++) {
                attrs.groupOffset = i;
                sprites[i].setAttributes(attrs);
            }
        }
        return sprites;
    }
});

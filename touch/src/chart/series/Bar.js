/**
 * TODO: Finish documentation
 * @extends Ext.chart.series.StackedCartesian
 */
Ext.define('Ext.chart.series.Bar', {

    extend: 'Ext.chart.series.StackedCartesian',

    alias: 'series.bar',
    type: 'bar',
    seriesType: 'barSeries',

    requires: [
        'Ext.chart.series.sprite.Bar',
        'Ext.draw.sprite.Rect'
    ],

    config: {
        itemInstancing: {
            type: 'rect',
            fx: {
                customDuration: {
                    x: 0,
                    y: 0,
                    width: 0,
                    height: 0,
                    radius: 0
                }
            }
        }
    },

    updateXAxis: function (axis) {
        axis.setLabelInSpan(true);
        this.callSuper(arguments);
    },

    updateStacked: function (stacked) {
        var sprites = this.getSprites(),
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
        this.callSuper(arguments);
    }
});

/**
 * TODO(zhangbei): Documents
 */
Ext.define('Ext.chart.SpaceFillingChart', {

    extend: 'Ext.chart.AbstractChart',
    xtype: 'spacefilling',

    config: {

    },

    performLayout: function () {
        try {
            this.resizing = true;
            var me = this,
                size = me.element.getSize(),
                series = me.getSeries(), seriesItem,
                padding = me.getInsetPadding(),
                width = size.width - padding.left - padding.right,
                height = size.height - padding.top - padding.bottom,
                region = [padding.left, padding.top, width, height],
                i, ln;
            this.getSurface().setRegion(region);
            me.setMainRegion(region);
            for (i = 0, ln = series.length; i < ln; i++) {
                seriesItem = series[i];
                seriesItem.getSurface().setRegion(region);
                seriesItem.setRegion(region);
            }
            this.redraw();
        } finally {
            this.resizing = false;
        }
    },

    redraw: function () {
        var me = this,
            serieses = me.getSeries(), series,
            i, ln;
        
        for (i = 0, ln = serieses.length; i < ln; i++) {
            series = serieses[i];
            series.getSprites();
        }
        this.renderFrame();
    }
});
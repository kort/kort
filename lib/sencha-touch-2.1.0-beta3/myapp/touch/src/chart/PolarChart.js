/**
 * TODO(zhangbei): Documents
 */
Ext.define('Ext.chart.PolarChart', {

    extend: 'Ext.chart.AbstractChart',
    xtype: 'polar',

    config: {
        center: [0, 0],
        radius: 0
    },

    applyCenter: function (center, oldCenter) {
        if (oldCenter && center[0] === oldCenter[0] && center[1] === oldCenter[1]) {
            return;
        }
        return [+center[0], +center[1]];
    },

    updateCenter: function (center) {
        var me = this,
            axes = me.getAxes(), axis,
            series = me.getSeries(), seriesItem,
            i, ln;
        for (i = 0, ln = axes.length; i < ln; i++) {
            axis = axes[i];
            axis.setCenter(center);
        }

        for (i = 0, ln = series.length; i < ln; i++) {
            seriesItem = series[i];
            seriesItem.setCenter(center);
        }
    },

    updateRadius: function (radius) {
        var me = this,
            axes = me.getAxes(), axis,
            series = me.getSeries(), seriesItem,
            i, ln;
        for (i = 0, ln = axes.length; i < ln; i++) {
            axis = axes[i];
            axis.setRadius(radius);
        }

        for (i = 0, ln = series.length; i < ln; i++) {
            seriesItem = series[i];
            seriesItem.setRadius(radius);
        }
    },

    updateMainRegion: function (region) {
        var me = this,
            series = me.getSeries(), seriesItem,
            i, ln;
        this.getSurface().setRegion(region);
        for (i = 0, ln = series.length; i < ln; i++) {
            seriesItem = series[i];
            seriesItem.getSurface().setRegion(region);
        }
    },

    performLayout: function () {
        try {
            this.resizing = true;
            var me = this,
                size = me.element.getSize(),
                padding = me.getInsetPadding(),
                width = size.width - padding.left - padding.right,
                height = size.height - padding.top - padding.bottom,
                center = [width * 0.5, height * 0.5],
                radius = Math.min(width, height) * 0.5,
                region = [padding.left, padding.top, width, height],
                series = me.getSeries(), seriesItem,
                i, ln;

            for (i = 0, ln = series.length; i < ln; i++) {
                seriesItem = series[i];
                seriesItem.getOverlaySurface().setRegion([0, 0, size.width, size.height]);
                seriesItem.getOverlaySurface().matrix.set(1,0,0,1, padding.left, padding.top);
                seriesItem.getOverlaySurface().inverseMatrix.set(1,0,0,1, -padding.left, -padding.top);
            }
            
            this.setMainRegion(region);
            this.setRadius(radius);
            this.setCenter(center);

            this.redraw();
        } finally {
            this.resizing = false;
        }
    },

    redraw: function () {
        var me = this,
            size = me.element.getSize(),
            axes = me.getAxes(), axis,
            serieses = me.getSeries(), series,
            i, ln;
        for (i = 0, ln = axes.length; i < ln; i++) {
            axis = axes[i];
            axis.getSprites();
        }

        for (i = 0, ln = serieses.length; i < ln; i++) {
            series = serieses[i];
            series.getSprites();
        }
        this.renderFrame();
    }
});
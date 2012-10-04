/**
 *
 */
Ext.define("Ext.chart.series.sprite.Scatter", {
    alias: 'sprite.scatterSeries',
    extend: 'Ext.chart.series.sprite.Cartesian',
    renderClipped: function (surface, ctx, clip, clipRegion) {
        if (this.cleanRedraw) {
            return;
        }
        var attr = this.attr,
            dataX = attr.dataX,
            dataY = attr.dataY,
            matrix = this.attr.matrix,
            xx = matrix.getXX(),
            yy = matrix.getYY(),
            dx = matrix.getDX(),
            dy = matrix.getDY(),
            markerCfg = {},
            left = clipRegion[0],
            right = clipRegion[0] + clipRegion[2],
            top = clipRegion[1],
            bottom = clipRegion[1] + clipRegion[3],
            x, y;
        for (var i = 0; i < dataX.length; i++) {
            x = dataX[i];
            y = dataY[i];
            x = x * xx + dx;
            y = y * yy + dy;
            if (left <= x && x <= right && top <= y && y <= bottom) {
                if (attr.renderer) {
                    attr.renderer.call(this, markerCfg, this, i, this.getDataItems().items[i]);
                }
                markerCfg.translationX = x;
                markerCfg.translationY = y;
                this.putMarker("items", markerCfg, i, !attr.renderer);
            }
        }
    }
});

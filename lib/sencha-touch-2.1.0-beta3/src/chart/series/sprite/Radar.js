/**
 * Cartesian sprite.
 */
Ext.define("Ext.chart.series.sprite.Radar", {
    alias: 'sprite.radar',
    extend: 'Ext.chart.series.sprite.Polar',

    render: function (surface, ctx, region) {
        var me = this,
            attr = me.attr,
            centerX = attr.centerX,
            centerY = attr.centerY,
            dataRange = attr.dataRange,
            minX = dataRange[0],
            minY = dataRange[1],
            maxX = dataRange[2],
            maxY = dataRange[3],
            dataX = attr.dataX,
            dataY = attr.dataY,
            endRho = attr.endRho,
            startRho = attr.startRho,
            baseRotation = attr.baseRotation,
            i, length = dataX.length,
            markerCfg = {},
            surfaceMatrix = surface.inverseMatrix,
            x, y, r, th;
        ctx.beginPath();
        for (i = 0; i < length; i++) {
            th = (dataX[i] - minX) / (maxX - minX) * 2 * Math.PI + baseRotation;
            r = dataY[i] / maxY * (endRho - startRho) + startRho;
            ctx.lineTo(x = centerX + Math.cos(th) * r, y = centerY + Math.sin(th) * r);
            markerCfg.translationX = surfaceMatrix.x(x, y);
            markerCfg.translationY = surfaceMatrix.y(x, y);
            me.putMarker('items', markerCfg, i);
        }
        ctx.closePath();
        ctx.fillStroke(attr);
    }
});
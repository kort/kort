/**
 *
 */
Ext.define("Kitchensink.view.sprite.Column3D", {
    alias: 'sprite.columnSeries3d',
    extend: 'Ext.chart.series.sprite.Cartesian',
    inheritableStatics: {
        def: {
            processors: {
                maxBarWidth: 'number',
                minGapWidth: 'number'
            },
            defaults: {
                maxBarWidth: 6,
                minGapWidth: 5
            }
        }
    },

    lastClip: null,

    renderClipped: function (surface, ctx, clip) {
        var me = this,
            attr = me.attr,
            dataX = attr.dataX,
            dataY = attr.dataY,
            lineWidth = ctx.lineWidth || 1,
            offset = lineWidth * 0.5 - Math.floor(lineWidth * 0.5),
            matrix = attr.matrix,
            maxBarWidth = (dataX[dataX.length - 1] - dataX[0]) / (dataX.length - 1) * matrix.getXX() - lineWidth - attr.minGapWidth,
            barWidth = (Math.min(maxBarWidth, attr.maxBarWidth) * 0.5 + offset) * 0.66666,
            depthWidth = barWidth * 0.5, top, bottom,
            center, i , ln = dataX.length,
            xx = matrix.elements[0],
            dx = matrix.elements[4],
            yy = matrix.elements[3],
            dy = Math.round(matrix.elements[5]) + offset,
            color = Ext.draw.Color.create(attr.fillStyle),
            darkerColor = color.getDarker(0.05),
            lighterColor = color.getLighter(0.25);

        ctx.beginPath();
        for (i = 0; i < ln; i++) {
            center = Math.round(dataX[i] * xx + dx);
            top = Math.round(dataY[i] * yy + lineWidth) + dy;
            bottom = dy;
            ctx.moveTo(center - barWidth, top);
            ctx.lineTo(center - barWidth + depthWidth, top + depthWidth);
            ctx.lineTo(center + barWidth + depthWidth, top + depthWidth);
            ctx.lineTo(center + barWidth, top);
            ctx.lineTo(center - barWidth, top);

        }
        ctx.fillStyle = lighterColor.toString();
        matrix.toContext(ctx);
        ctx.fillStroke(attr);

        ctx.beginPath();
        for (i = 0; i < ln; i++) {
            center = Math.round(dataX[i] * xx + dx);
            top = Math.round(dataY[i] * yy + lineWidth) + dy;
            bottom = dy;
            ctx.moveTo(center + barWidth, top);
            ctx.lineTo(center + barWidth + depthWidth, top + depthWidth);
            ctx.lineTo(center + barWidth + depthWidth, bottom + depthWidth);
            ctx.lineTo(center + barWidth, bottom);
            ctx.lineTo(center + barWidth, top);
            bottom = dy;
        }
        ctx.fillStyle = darkerColor.toString();
        matrix.toContext(ctx);
        ctx.fillStroke(attr);

        ctx.beginPath();
        for (i = 0; i < ln; i++) {
            center = Math.round(dataX[i] * xx + dx);
            top = Math.round(dataY[i] * yy + lineWidth) + dy;
            bottom = dy;
            ctx.moveTo(center - barWidth, dy);
            ctx.lineTo(center - barWidth, top);
            ctx.lineTo(center + barWidth, top);
            ctx.lineTo(center + barWidth, dy);
            ctx.lineTo(center - barWidth, dy);

        }
        if (!(surface instanceof Ext.draw.engine.Svg)) {
            if (!this.lastClip || this.lastClip[0] !== Math.round(clip[1]) || this.lastClip[1] !== Math.round(clip[3])) {
                this.lastClip = [Math.round(clip[1]), Math.round(clip[3])];
                this.grad= ctx.createLinearGradient(0, clip[1], 0, clip[3]);
                this.grad.addColorStop(0, lighterColor.toString());
                this.grad.addColorStop(1, darkerColor.toString());
            }
            ctx.fillStyle = this.grad;
        } else {
            ctx.fillStyle = color.toString();
        }
        matrix.toContext(ctx);
        ctx.fillStroke(attr);
    }
});

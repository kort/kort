/**
 *
 */
Ext.define("Ext.chart.series.sprite.Line", {
    alias: 'sprite.lineSeries',
    extend: 'Ext.chart.series.sprite.Aggregative',

    inheritableStatics: {
        def: {
            processors: {
                smooth: 'bool',
                step: 'bool',
                preciseStroke: 'bool'
            },

            defaults: {
                smooth: false,
                step: false,
                transformFillStroke: true,
                preciseStroke: false
            }
        }
    },

    requires: ['Ext.draw.RMQ'],
    list: null,

    updatePlainBBox: function (plain) {
        var dataRange = this.attr.dataRange,
            ymin = Math.min(0, dataRange[1]),
            ymax = Math.max(0, dataRange[3]);
        plain.x = dataRange[0];
        plain.y = ymin;
        plain.width = dataRange[2] - dataRange[0];
        plain.height = ymax - ymin;
    },

    drawStroke: function (surface, ctx, list) {
        var attr = this.attr,
            smooth = attr.smooth,
            step = attr.step,
            i;
        ctx.beginPath();
        if (smooth) {
            ctx.moveTo(list[0], list[1]);
            for (i = 3; i < list.length; i += 3) {
                ctx.bezierCurveTo(
                    (list[i - 2] + list[i]) / 2, list[i - 1],
                    (list[i - 2] + list[i]) / 2, list[i + 1],
                    list[i], list[i + 1]);
            }
        } else if (step) {
            ctx.moveTo(list[0], list[1]);
            for (i = 3; i < list.length; i += 3) {
                ctx.lineTo(list[i], list[i - 1]);
                ctx.lineTo(list[i], list[i + 1]);
            }
        } else {
            ctx.moveTo(list[0], list[1]);
            for (i = 3; i < list.length; i += 3) {
                ctx.lineTo(list[i], list[i + 1]);
            }
        }
    },

    renderAggregates: function (aggregates, start, end, surface, ctx, clip, region) {
        var me = this,
            attr = me.attr,
            dataX = attr.dataX,
            matrix = attr.matrix,
            first = true,
            dataY = attr.dataY,
            pixel = surface.devicePixelRatio,
            xx = matrix.getXX(),
            yy = matrix.getYY(),
            dx = matrix.getDX(),
            dy = matrix.getDY(),
            markerCfg = {},
            list = this.list || (this.list = []),
            x, y,
            minXs = aggregates.minX,
            maxXs = aggregates.maxX,
            minYs = aggregates.minY,
            maxYs = aggregates.maxY,
            left = region[0],
            right = region[0] + region[2],
            top = region[1],
            bottom = region[1] + region[3],
            surfaceMatrix = surface.matrix;

        list.length = 0;
        for (var i = start; i < end; i++) {
            var minX = minXs[i],
                maxX = maxXs[i],
                minY = minYs[i],
                maxY = maxYs[i];

            if (minX < maxX) {
                list.push(minX * xx + dx, minY * yy + dy, i);
                list.push(maxX * xx + dx, maxY * yy + dy, i);
            } else if (minX > maxX) {
                list.push(maxX * xx + dx, maxY * yy + dy, i);
                list.push(minX * xx + dx, minY * yy + dy, i);
            } else {
                list.push(maxX * xx + dx, maxY * yy + dy, i);
            }
            first = false;
        }

        if (list.length) {
            for (i = 0; i < list.length; i += 3) {
                x = list[i];
                y = list[i + 1];
                if (left <= x && x <= right && top <= y && y <= bottom) {
                    markerCfg.translationX = surfaceMatrix.x(x, y);
                    markerCfg.translationY = surfaceMatrix.y(x, y);
                    me.putMarker('items', markerCfg, list[i + 2]);
                }
            }
            me.drawStroke(surface, ctx, list);
            ctx.lineTo(dataX[dataX.length - 1] * xx + dx + pixel, dataY[dataY.length - 1] * yy + dy);
            ctx.lineTo(dataX[dataX.length - 1] * xx + dx + pixel, dy - pixel);
            ctx.lineTo(dataX[0] * xx + dx - pixel, dy - pixel);
            ctx.lineTo(dataX[0] * xx + dx - pixel, dataY[0] * yy + dy);
            ctx.closePath();
            if (attr.preciseStroke) {
                ctx.fill();
                me.drawStroke(surface, ctx, list);
                ctx.stroke();
            } else {
                ctx.fillStroke(attr);
            }
        }
    }
});
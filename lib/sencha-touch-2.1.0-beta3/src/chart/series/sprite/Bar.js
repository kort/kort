/**
 *
 */
Ext.define("Ext.chart.series.sprite.Bar", {
    alias: 'sprite.barSeries',
    extend: 'Ext.chart.series.sprite.StackedCartesian',

    inheritableStatics: {
        def: {
            processors: {
                minBarWidth: 'number',
                maxBarWidth: 'number',
                minGapWidth: 'number',
                groupCount: 'number',
                groupOffset: 'number',
                inGroupGapWidth: 'number'
            },
            defaults: {
                minBarWidth: 2,
                maxBarWidth: 30,
                minGapWidth: 5,
                groupCount: 1,
                groupOffset: 0,
                inGroupGapWidth: 3,
                transformFillStroke: true
            }
        }
    },

    preRender: function (surface) {
        var parent = this.getParent(),
            matrix = new Ext.draw.Matrix(),
            region = surface.getRegion();
        while (parent && parent.attr && parent.attr.matrix) {
            matrix.prependMatrix(parent.attr.matrix);
            parent = parent.getParent();
        }
        matrix.prependMatrix(parent.matrix);
        this.surfaceMatrix = matrix;
        this.callSuper(arguments);
    },

    // TODO: design this more carefully
    drawLabel: function (text, dataX, dataStartY, dataY, labelId) {
        var me = this,
            attr = this.attr,
            labelCfg = this.labelCfg || (this.labelCfg = {}),
            surfaceMatrix = this.surfaceMatrix,
            labelX, labelY,
            labelOverflowPadding = attr.labelOverflowPadding,
            halfWidth,
            labelBox;

        labelBox = this.getMarkerBBox('labels', labelId, true);
        labelCfg.text = text;
        if (!labelBox) {
            me.putMarker('labels', labelCfg, labelId);
            labelBox = this.getMarkerBBox('labels', labelId, true);
        }
        if (!attr.flipXY) {
            labelCfg.rotationRads = Math.PI * 0.5;
        } else {
            labelCfg.rotationRads = 0;
        }
        labelCfg.calloutVertical = !attr.flipXY;

        halfWidth = (labelBox.width / 2 + labelOverflowPadding);
        labelX = dataX;
        labelY = dataY - halfWidth;
        labelCfg.x = surfaceMatrix.x(labelX, labelY);
        labelCfg.y = surfaceMatrix.y(labelX, labelY);
        labelX = dataX;
        labelY = dataY + halfWidth;
        labelCfg.calloutPlaceX = surfaceMatrix.x(labelX, labelY);
        labelCfg.calloutPlaceY = surfaceMatrix.y(labelX, labelY);
        labelX = dataX;
        labelY = dataY;
        labelCfg.calloutStartX = surfaceMatrix.x(labelX, labelY);
        labelCfg.calloutStartY = surfaceMatrix.y(labelX, labelY);
        if (dataY - dataStartY > halfWidth * 2) {
            labelCfg.callout = 0;
        } else {
            labelCfg.callout = 1;
        }
        me.putMarker('labels', labelCfg, labelId);
    },

    renderClipped: function (surface, ctx, clip) {
        var me = this,
            attr = me.attr,
            dataX = attr.dataX,
            dataY = attr.dataY,
            dataText = attr.labels,
            dataStartY = attr.dataStartY,
            groupCount = attr.groupCount,
            groupOffset = attr.groupOffset - (groupCount - 1) * 0.5,
            inGroupGapWidth = attr.inGroupGapWidth,
            startY, y, labelId,
            lineWidth = ctx.lineWidth || 1,
            matrix = attr.matrix,
            maxBarWidth = (dataX[dataX.length - 1] - dataX[0]) / (dataX.length - 1) * matrix.getXX() - lineWidth - attr.minGapWidth,
            barWidth = surface.roundPixel(Math.max(attr.minBarWidth, (Math.min(maxBarWidth, attr.maxBarWidth) - inGroupGapWidth * (groupCount - 1)) / groupCount)),
            surfaceMatrix = this.surfaceMatrix,
            mid, left, right, bottom, top, i, center,
            halfLineWidth = 0.5 * (attr.lineWidth || 1),
            xx = matrix.elements[0],
            dx = matrix.elements[4],
            yy = matrix.elements[3],
            dy = surface.roundPixel(matrix.elements[5]) - 1,
            start = Math.max(0, Math.floor(clip[0])),
            end = Math.min(dataX.length - 1, Math.ceil(clip[2])),
            drawMarkers = dataText && !!this.getBoundMarker("labels");

        ctx.beginPath();

        for (i = start; i <= end; i++) {
            center = dataX[i] * xx + dx + groupOffset * (barWidth + inGroupGapWidth);
            mid = surface.roundPixel(center);
            left = surface.roundPixel(center - barWidth * 0.5) + halfLineWidth;
            right = surface.roundPixel(center + barWidth * 0.5) - halfLineWidth;
            startY = dataStartY ? dataStartY[i] : 0;
            y = dataY[i];
            top = surface.roundPixel(y * yy + lineWidth + dy);
            bottom = surface.roundPixel(startY * yy + lineWidth + dy);
            ctx.moveTo(left, surface.roundPixel(startY * yy + lineWidth + dy) - halfLineWidth);
            ctx.lineTo(left, top - halfLineWidth);
            ctx.lineTo(right, top - halfLineWidth);
            ctx.lineTo(right, surface.roundPixel(startY * yy + lineWidth + dy) - halfLineWidth);
            ctx.lineTo(left, surface.roundPixel(startY * yy + lineWidth + dy) - halfLineWidth);

            labelId = attr.attributeId + '-' + i;
            if (drawMarkers) {
                this.drawLabel(dataText[i], mid, bottom, top, labelId);
            }
            me.putMarker('items', {
                translationX: surfaceMatrix.x(mid, top),
                translationY: surfaceMatrix.y(mid, top)
            }, labelId);
        }

        ctx.fillStroke(attr);
    }
});

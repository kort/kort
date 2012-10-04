/**
 * Stacked cartesian sprite.
 */
Ext.define("Ext.chart.series.sprite.StackedCartesian", {
    extend: 'Ext.chart.series.sprite.Cartesian',
    inheritableStatics: {
        def: {
            processors: {
                groupCount: 'number',
                groupOffset: 'number',
                dataStartY: 'data'
            },
            defaults: {
                groupCount: 1,
                groupOffset: 0,
                dataStartY: null,
                transformFillStroke: true
            },
            dirtyTriggers: {
                dataStartY: 'dataY,bbox'
            }
        }
    },

    /**
     * Get the nearest item index from point (x, y). -1 as not found.
     * @param {Number} x
     * @param {Number} y
     * @return {Number} The index
     */
    getIndexNearPoint: function (x, y) {
        var sprite = this,
            mat = sprite.attr.matrix,
            dataX = sprite.attr.dataX,
            dataY = sprite.attr.dataY,
            dataStartY = sprite.attr.dataStartY,
            minX, minY, index = -1,
            imat = mat.clone().prependMatrix(this.surfaceMatrix).inverse(),
            center = imat.transformPoint([x, y]),
            positionLB = imat.transformPoint([x - 22, y - 22]),
            positionTR = imat.transformPoint([x + 22, y + 22]),
            dx, dy,
            left = Math.min(positionLB[0], positionTR[0]),
            right = Math.max(positionLB[0], positionTR[0]);

        for (var i = 0; i < dataX.length; i++) {
            if (left <= dataX[i] && dataX[i] <= right && dataStartY[i] <= center[1] && center[1] <= dataY[i]) {
                dx = Math.abs(dataX[i] - center[0]);
                dy = Math.max(-Math.min(dataY[i] - center[1], center[1] - dataStartY[i]), 0);
                if (index === -1 || dx < minX && dy <= minY) {
                    minX = dx;
                    minY = dy;
                    index = i;
                }
            }
        }

        return index;
    }
});
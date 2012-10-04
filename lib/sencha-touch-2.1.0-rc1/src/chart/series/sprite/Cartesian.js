/**
 * Cartesian sprite.
 */
Ext.define("Ext.chart.series.sprite.Cartesian", {
    extend: 'Ext.draw.sprite.Sprite',
    mixins: {
        markerHolder: "Ext.chart.MarkerHolder"
    },
    homogeneous: true,
    ascending: true,
    inheritableStatics: {
        def: {
            processors: {
                dataRange: 'data',
                dataY: 'data',
                dataX: 'data',
                labels: 'default',
                labelOverflowPadding: 'number',
                flipXY: 'bool',
                renderer: 'default'
            },
            defaults: {
                dataY: null,
                dataX: null,
                dataRange: [0, 0, 1, 1],
                labels: null,
                labelOverflowPadding: 10,
                flipXY: false,
                renderer: null
            },
            dirtyTriggers: {
                dataX: 'dataX,bbox',
                dataY: 'dataY,bbox',
                dataRange: 'bbox'
            },
            updaters: {
                'dataX': function (attrs) {
                    this.processDataX();
                    if (!attrs.dirtyFlags.dataY) {
                        attrs.dirtyFlags.dataY = [];
                    }
                    attrs.dirtyFlags.dataY.push('dataY');
                },
                'dataY': function () {
                    this.processDataY();
                }
            }
        }
    },

    config: {
        flipXY: false,
        dataItems: null,
        field: null
    },

    processDataY: Ext.emptyFn,

    processDataX: Ext.emptyFn,

    updatePlainBBox: function (plain) {
        var dataRange = this.attr.dataRange;
        if (dataRange) {
            plain.x = dataRange[0];
            plain.y = dataRange[1];
            plain.width = dataRange[2] - dataRange[0];
            plain.height = dataRange[3] - dataRange[1];
        } else {
            plain.x = 0;
            plain.y = 0;
            plain.width = 1;
            plain.height = 1;
        }
    },

    binarySearch: function (key) {
        var dx = this.attr.dataX,
            start = 0,
            end = dx.length;
        if (key <= dx[0]) {
            return start;
        }
        if (key >= dx[end - 1]) {
            return end - 1;
        }
        while (start + 1 < end) {
            var mid = (start + end) >> 1,
                val = dx[mid];
            if (val === key) {
                return mid;
            } else if (val < key) {
                start = mid;
            } else {
                end = mid;
            }
        }
        return start;
    },

    render: function (surface, ctx, region) {
        var me = this,
            flipXY = me.getFlipXY(),
            attr = me.attr,
            inverseMatrix = attr.inverseMatrix.clone();

        inverseMatrix.appendMatrix(surface.inverseMatrix);

        if (attr.dataX === null) {
            return;
        }
        if (attr.dataY === null) {
            return;
        }

        if (inverseMatrix.getXX() * inverseMatrix.getYX() || inverseMatrix.getXY() * inverseMatrix.getYY()) {
            console.log('Cartesian Series sprite does not support rotation/sheering');
            return;
        }


        var clip = inverseMatrix.transformList([
            [region[0] - 1, region[3] + 1],
            [region[0] + region[2] + 1, -1]
        ]);

        clip = clip[0].concat(clip[1]);

        if (clip[2] < clip[0]) {
            console.log('Cartesian Series sprite does not supports flipped X.');
            // TODO: support it
            return;
        }
        me.renderClipped(surface, ctx, clip, region);
    },

    /**
     *
     * @param surface
     * @param ctx
     * @param clip
     * @param region
     */
    renderClipped: Ext.emptyFn,

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
            minX, minY, index = -1,
            imat = mat.clone().prependMatrix(this.surfaceMatrix).inverse(),
            center = imat.transformPoint([x, y]),
            positionLB = imat.transformPoint([x - 22, y - 22]),
            positionTR = imat.transformPoint([x + 22, y + 22]),
            left = Math.min(positionLB[0], positionTR[0]),
            right = Math.max(positionLB[0], positionTR[0]),
            top = Math.min(positionLB[1], positionTR[1]),
            bottom = Math.max(positionLB[1], positionTR[1]);

        for (var i = 0; i < dataX.length; i++) {
            if (left < dataX[i] && dataX[i] < right && top < dataY[i] && dataY[i] < bottom) {
                if (index === -1 || Math.abs(dataX[i] - center[0]) < minX &&
                    Math.abs(dataY[i] - center[1]) < minY) {
                    minX = Math.abs(dataX[i] - center[0]);
                    minY = Math.abs(dataY[i] - center[1]);
                    index = i;
                }
            }
        }

        return index;
    }
});
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
                flipXY: 'bool'
            },
            defaults: {
                dataY: null,
                dataX: null,
                dataRange: null,
                labels: null,
                labelOverflowPadding: 10,
                flipXY: false
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
        flipXY: false
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
        
        inverseMatrix.postpendMatrix(surface.inverseMatrix);
        
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

        if (flipXY) {
            var temp = clip[0];
            clip[0] = clip[1];
            clip[1] = temp;

            temp = clip[2];
            clip[2] = clip[3];
            clip[3] = temp;
        }

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
    renderClipped: Ext.emptyFn
});
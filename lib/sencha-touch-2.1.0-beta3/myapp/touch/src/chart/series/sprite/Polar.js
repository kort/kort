/**
 * Polar sprite.
 */
Ext.define("Ext.chart.series.sprite.Polar", {
    mixins: {
        markerHolder: "Ext.chart.MarkerHolder"
    },
    extend: 'Ext.draw.sprite.Sprite',
    inheritableStatics: {
        def: {
            processors: {
                dataRange: 'data',
                dataY: 'data',
                dataX: 'data',
                centerX: 'number',
                centerY: 'number',
                startAngle: "number",
                endAngle: "number",
                startRho: "number",
                endRho: "number",
                baseRotation: "number"
            },
            defaults: {
                dataY: null,
                dataX: null,
                dataRange: null,
                centerX: 0,
                centerY: 0,
                startAngle: 0,
                endAngle: Math.PI,
                startRho: 0,
                endRho: 150,
                baseRotation: 0
            },
            dirtyTriggers: {
                dataX: 'bbox',
                dataY: 'bbox',
                dataRange: 'bbox',
                centerX: "bbox",
                centerY: "bbox",
                startAngle: "bbox",
                endAngle: "bbox",
                startRho: "bbox",
                endRho: "bbox",
                baseRotation: "bbox"
            }
        }
    },

    updatePlainBBox: function (plain) {
        var attr = this.attr;
        plain.x = attr.centerX - attr.endRho;
        plain.y = attr.centerY + attr.endRho;
        plain.width = attr.endRho * 2;
        plain.height = attr.endRho * 2;
    }
});
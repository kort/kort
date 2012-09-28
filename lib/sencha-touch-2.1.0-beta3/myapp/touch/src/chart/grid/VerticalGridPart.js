/**
 *
 */
Ext.define("Ext.chart.grid.VerticalGridPart", {
    extend: 'Ext.draw.sprite.Sprite',

    inheritableStatics: {
        def: {
            processors: {
                x: 'number',
                y: 'number',
                width: 'number',
                height: 'number'
            },

            defaults: {
                x: 0,
                y: 0,
                width: 1,
                height: 1,
                fill: 'gray',
                stroke: '#DDD'
            }
        }
    },

    render: function (surface, ctx, clipRegion) {
        var attr = this.attr,
            x = surface.roundPixel(attr.x),
            y = attr.y,
            w = attr.width,
            h = attr.height,
            halfLineWidth = ctx.lineWidth * 0.5;
        ctx.beginPath();
        ctx.moveTo(x - halfLineWidth, clipRegion[1] - surface.matrix.getDY());
        ctx.lineTo(x - halfLineWidth, clipRegion[1] + clipRegion[3] - surface.matrix.getDY());
        ctx.stroke();
    }
});
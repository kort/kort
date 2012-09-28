Ext.define("Ext.draw.sprite.EllipticalArc", {
    extend: "Ext.draw.sprite.Ellipse",
    alias: 'sprite.ellipticalArc',
    type: 'ellipticalArc',
    inheritableStatics: {
        def: {
            processors: {
                startAngle: "number",
                endAngle: "number",
                anticlockwise: "bool"
            },
            aliases: {
                from: "startAngle",
                to: "endAngle",
                start: "startAngle",
                end: "endAngle"
            },
            defaults: {
                startAngle: 0,
                endAngle: Math.PI * 2,
                anticlockwise: false
            },
            dirtyTriggers: {
                startAngle: 'path',
                endAngle: 'path',
                anticlockwise: 'path'
            }
        }
    },

    drawPath: function (path, attr) {
        path.ellipse(attr.cx, attr.cy, attr.rx, attr.ry, attr.axisRotation, attr.startAngle, attr.endAngle, attr.anticlockwise);
    }
});
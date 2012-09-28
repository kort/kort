Ext.define("Ext.draw.sprite.Arc", {
    extend: "Ext.draw.sprite.Circle",
    alias: 'sprite.arc',
    type: 'arc',
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
        path.arc(attr.cx, attr.cy, attr.r, attr.startAngle, attr.endAngle, attr.anticlockwise);
    }
});
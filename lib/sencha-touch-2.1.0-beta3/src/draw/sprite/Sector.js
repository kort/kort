/**
 *
 */
Ext.define("Ext.draw.sprite.Sector", {
    extend: "Ext.draw.sprite.Path",
    alias: 'sprite.sector',
    type: 'sector',
    inheritableStatics: {
        def: {
            processors: {
                centerX: "number",
                centerY: "number",
                startAngle: "number",
                endAngle: "number",
                startRho: "number",
                endRho: "number",
                margin: "number"
            },
            aliases: {
                rho: 'endRho'
            },
            dirtyTriggers: {
                centerX: "path,bbox",
                centerY: "path,bbox",
                startAngle: "path,bbox",
                endAngle: "path,bbox",
                startRho: "path,bbox",
                endRho: "path,bbox",
                margin: "path,bbox"
            },
            defaults: {
                centerX: 0,
                centerY: 0,
                startAngle: 0,
                endAngle: 0,
                startRho: 0,
                endRho: 150,
                margin: 0,
                path: 'M 0,0'
            }
        }
    },

    drawPath: function (path, attr) {
        var startAngle = Math.min(attr.startAngle, attr.endAngle),
            endAngle = Math.max(attr.startAngle, attr.endAngle),
            midAngle = (startAngle + endAngle) * 0.5,
            margin = attr.margin,
            centerX = attr.centerX,
            centerY = attr.centerY,
            startRho = Math.min(attr.startRho, attr.endRho),
            endRho = Math.max(attr.startRho, attr.endRho);

        if (margin) {
            centerX += margin * Math.cos(midAngle);
            centerY += margin * Math.sin(midAngle);
        }
        path.moveTo(centerX + startRho * Math.cos(startAngle), centerY + startRho * Math.sin(startAngle));
        path.lineTo(centerX + endRho * Math.cos(startAngle), centerY + endRho * Math.sin(startAngle));
        path.arc(centerX, centerY, endRho, startAngle, endAngle, false);
        path.lineTo(centerX + startRho * Math.cos(endAngle), centerY + startRho * Math.sin(endAngle));
        path.arc(centerX, centerY, startRho, endAngle, startAngle, true);
    }
});
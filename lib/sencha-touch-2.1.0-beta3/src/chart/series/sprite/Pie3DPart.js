/**
 *
 */
Ext.define("Ext.chart.series.sprite.Pie3DPart", {
    extend: 'Ext.draw.sprite.Path',
    mixins: {
        markerHolder: "Ext.chart.MarkerHolder"
    },
    alias: 'sprite.pie3dPart',
    type: 'pie3dPart',
    inheritableStatics: {
        def: {
            processors: {
                centerX: "number",
                centerY: "number",
                startAngle: "number",
                endAngle: "number",
                startRho: "number",
                endRho: "number",
                margin: "number",
                thickness: "number",
                distortion: "number",
                baseColor: "color",
                baseRotation: "number",
                part: "enums(top,start,end,inner,outer)"
            },
            aliases: {
                rho: 'endRho'
            },
            dirtyTriggers: {
                centerX: "path,bbox",
                centerY: "path,bbox",
                startAngle: "path,partZIndex",
                endAngle: "path,partZIndex",
                startRho: "path",
                endRho: "path,bbox",
                margin: "path,bbox",
                thickness: "path",
                baseRotation: "path,partZIndex",
                baseColor: 'partZIndex,partColor',
                part: "path,partZIndex"
            },
            defaults: {
                centerX: 0,
                centerY: 0,
                startAngle: 0,
                endAngle: 0,
                startRho: 0,
                endRho: 150,
                margin: 0,
                distortion: 1,
                baseRotation: 0,
                baseColor: 'white',
                part: "top"
            },
            updaters: {
                "partColor": function (attrs) {
                    var color = Ext.draw.Color.create(attrs.baseColor),
                        fillStyle;
                    switch (attrs.part) {
                        case 'top':
                            fillStyle = color.toString();
                            break;
                        case 'outer':
                            fillStyle = Ext.create("Ext.draw.gradient.Linear", {
                                type: 'linear',
                                stops: [
                                    {
                                        offset: 0,
                                        color: color.getDarker(0.3).toString()
                                    },
                                    {
                                        offset: 0.3,
                                        color: color.toString()
                                    },
                                    {
                                        offset: 0.8,
                                        color: color.getLighter(0.2).toString()
                                    },
                                    {
                                        offset: 1,
                                        color: color.getDarker(0.4).toString()
                                    }
                                ]
                            });
                            break;
                        case 'start':
                            fillStyle = color.getDarker(0.3).toString();
                            break;
                        case 'end':
                            fillStyle = color.getDarker(0.3).toString();
                            break;
                        case 'inner':
                            fillStyle = Ext.create("Ext.draw.gradient.Linear", {
                                type: 'linear',
                                stops: [
                                    {
                                        offset: 0,
                                        color: color.getDarker(0.4).toString()
                                    },
                                    {
                                        offset: 0.2,
                                        color: color.getLighter(0.2).toString()
                                    },
                                    {
                                        offset: 0.7,
                                        color: color.toString()
                                    },
                                    {
                                        offset: 1,
                                        color: color.getDarker(0.3).toString()
                                    }
                                ]
                            });
                            break;
                    }

                    attrs.fillStyle = fillStyle;
                    attrs.canvasAttributes.fillStyle = fillStyle;
                },
                "partZIndex": function (attrs) {
                    var rotation = attrs.baseRotation;
                    switch (attrs.part) {
                        case 'top':
                            attrs.zIndex = 5;
                            break;
                        case 'outer':
                            attrs.zIndex = 4;
                            break;
                        case 'start':
                            attrs.zIndex = 1 + Math.sin(attrs.startAngle + rotation);
                            break;
                        case 'end':
                            attrs.zIndex = 1 + Math.sin(attrs.endAngle + rotation);
                            break;
                        case 'inner':
                            attrs.zIndex = 1;
                            break;
                    }
                    attrs.dirtyZIndex = true;
                }
            }
        }
    },

    updatePlainBBox: function (plain) {
        var attr = this.attr,
            rho = attr.part === 'inner' ? attr.startRho : attr.endRho;
        plain.width = rho * 2;
        plain.height = rho * attr.distortion * 2 + attr.thickness;
        plain.x = attr.centerX - rho;
        plain.y = attr.centerY - rho * attr.distortion;
    },
    
    updateTransformedBBox: function (transform) {
        return this.updatePlainBBox(transform);
    },
    
    drawPath: function (path) {
        if (this.attr.endAngle < this.attr.startAngle) {
            return;
        }
        this[this.attr.part + 'Renderer'](path);
    },

    topRenderer: function (path) {
        var attr = this.attr,
            margin = attr.margin,
            distortion = attr.distortion,
            centerX = attr.centerX,
            centerY = attr.centerY,
            baseRotation = attr.baseRotation,
            startAngle = attr.startAngle + baseRotation ,
            endAngle = attr.endAngle + baseRotation ,
            startRho = attr.startRho,
            endRho = attr.endRho,
            midAngle,
            sinEnd = Math.sin(endAngle),
            cosEnd = Math.cos(endAngle);
        midAngle = (startAngle + endAngle) * 0.5;
        centerX += Math.cos(midAngle) * margin;
        centerY += Math.sin(midAngle) * margin * distortion;
        path.ellipse(centerX, centerY, startRho, startRho * distortion, 0, startAngle, endAngle, false);
        path.lineTo(centerX + cosEnd * endRho, centerY + sinEnd * endRho * distortion);
        path.ellipse(centerX, centerY, endRho, endRho * distortion, 0, endAngle, startAngle, true);
        path.closePath();
    },

    startRenderer: function (path) {
        var attr = this.attr,
            margin = attr.margin,
            centerX = attr.centerX,
            centerY = attr.centerY,
            distortion = attr.distortion,
            baseRotation = attr.baseRotation,
            startAngle = attr.startAngle + baseRotation ,
            endAngle = attr.endAngle + baseRotation,
            thickness = attr.thickness,
            startRho = attr.startRho,
            endRho = attr.endRho,
            sinStart = Math.sin(startAngle),
            cosStart = Math.cos(startAngle),
            midAngle;
        if (cosStart < 0) {
            midAngle = (startAngle + endAngle) * 0.5;
            centerX += Math.cos(midAngle) * margin;
            centerY += Math.sin(midAngle) * margin * distortion;
            path.moveTo(centerX + cosStart * startRho, centerY + sinStart * startRho * distortion);
            path.lineTo(centerX + cosStart * endRho, centerY + sinStart * endRho * distortion);
            path.lineTo(centerX + cosStart * endRho, centerY + sinStart * endRho * distortion + thickness);
            path.lineTo(centerX + cosStart * startRho, centerY + sinStart * startRho * distortion + thickness);
            path.closePath();
        }
    },

    endRenderer: function (path) {
        var attr = this.attr,
            margin = attr.margin,
            centerX = attr.centerX,
            centerY = attr.centerY,
            distortion = attr.distortion,
            baseRotation = attr.baseRotation,
            startAngle = attr.startAngle + baseRotation ,
            endAngle = attr.endAngle + baseRotation,
            thickness = attr.thickness,
            startRho = attr.startRho,
            endRho = attr.endRho,
            sin = Math.sin(endAngle),
            cos = Math.cos(endAngle), midAngle;
        if (cos > 0) {
            midAngle = (startAngle + endAngle) * 0.5;
            centerX += Math.cos(midAngle) * margin;
            centerY += Math.sin(midAngle) * margin * distortion;
            path.moveTo(centerX + cos * startRho, centerY + sin * startRho * distortion);
            path.lineTo(centerX + cos * endRho, centerY + sin * endRho * distortion);
            path.lineTo(centerX + cos * endRho, centerY + sin * endRho * distortion + thickness);
            path.lineTo(centerX + cos * startRho, centerY + sin * startRho * distortion + thickness);
            path.closePath();
        }
    },

    innerRenderer: function (path) {
        var attr = this.attr,
            margin = attr.margin,
            centerX = attr.centerX,
            centerY = attr.centerY,
            distortion = attr.distortion,
            baseRotation = attr.baseRotation,
            startAngle = attr.startAngle + baseRotation ,
            endAngle = attr.endAngle + baseRotation,
            thickness = attr.thickness,
            startRho = attr.startRho,
            sinEnd, cosEnd,
            tempStart, tempEnd, midAngle;
        midAngle = (startAngle + endAngle) * 0.5;
        centerX += Math.cos(midAngle) * margin;
        centerY += Math.sin(midAngle) * margin * distortion;
        if (startAngle >= Math.PI * 2) {
            startAngle -= Math.PI * 2;
            endAngle -= Math.PI * 2;
        }
        if (endAngle > Math.PI && endAngle < Math.PI * 3) {
            tempStart = startAngle;
            tempEnd = Math.min(endAngle, Math.PI * 2);
            sinEnd = Math.sin(tempEnd);
            cosEnd = Math.cos(tempEnd);
            path.ellipse(centerX, centerY, startRho, startRho * distortion, 0, tempStart, tempEnd, false);
            path.lineTo(centerX + cosEnd * startRho, centerY + sinEnd * startRho * distortion + thickness);
            path.ellipse(centerX, centerY + thickness, startRho, startRho * distortion, 0, tempEnd, tempStart, true);
            path.closePath();
        }
        if (endAngle > Math.PI * 3) {
            tempStart = Math.PI;
            tempEnd = endAngle;
            sinEnd = Math.sin(tempEnd);
            cosEnd = Math.cos(tempEnd);
            path.ellipse(centerX, centerY, startRho, startRho * distortion, 0, tempStart, tempEnd, false);
            path.lineTo(centerX + cosEnd * startRho, centerY + sinEnd * startRho * distortion + thickness);
            path.ellipse(centerX, centerY + thickness, startRho, startRho * distortion, 0, tempEnd, tempStart, true);
            path.closePath();
        }
    },

    outerRenderer: function (path) {
        var attr = this.attr,
            margin = attr.margin,
            centerX = attr.centerX,
            centerY = attr.centerY,
            distortion = attr.distortion,
            baseRotation = attr.baseRotation,
            startAngle = attr.startAngle + baseRotation ,
            endAngle = attr.endAngle + baseRotation,
            thickness = attr.thickness,
            endRho = attr.endRho,
            sinEnd, cosEnd,
            tempStart, tempEnd, midAngle;
        midAngle = (startAngle + endAngle) * 0.5;
        centerX += Math.cos(midAngle) * margin;
        centerY += Math.sin(midAngle) * margin * distortion;

        if (startAngle >= Math.PI * 2) {
            startAngle -= Math.PI * 2;
            endAngle -= Math.PI * 2;
        }

        if (startAngle < Math.PI) {
            tempStart = startAngle;
            tempEnd = Math.min(endAngle, Math.PI);
            sinEnd = Math.sin(tempEnd);
            cosEnd = Math.cos(tempEnd);
            path.ellipse(centerX, centerY, endRho, endRho * distortion, 0, tempStart, tempEnd, false);
            path.lineTo(centerX + cosEnd * endRho, centerY + sinEnd * endRho * distortion + thickness);
            path.ellipse(centerX, centerY + thickness, endRho, endRho * distortion, 0, tempEnd, tempStart, true);
            path.closePath();
        }
        if (endAngle > Math.PI * 2) {
            tempStart = Math.max(startAngle, Math.PI * 2);
            tempEnd = endAngle;
            sinEnd = Math.sin(tempEnd);
            cosEnd = Math.cos(tempEnd);
            path.ellipse(centerX, centerY, endRho, endRho * distortion, 0, tempStart, tempEnd, false);
            path.lineTo(centerX + cosEnd * endRho, centerY + sinEnd * endRho * distortion + thickness);
            path.ellipse(centerX, centerY + thickness, endRho, endRho * distortion, 0, tempEnd, tempStart, true);
            path.closePath();
        }
    }
});
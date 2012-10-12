/**
 * @class
 * A class that imitates a canvas context but generates svg elements instead.
 */
Ext.define('Ext.draw.engine.SvgContext', {
    /**
     * @private
     * Properties to be saved/restored in `save` and `restore` method.
     */
    toSave: ["strokeOpacity", "strokeStyle", "fillOpacity", "fillStyle", "globalAlpha", "lineWidth", "lineCap", "lineJoin", "miterLimit", "shadowOffsetX", "shadowOffsetY", "shadowBlur", "shadowColor", "globalCompositeOperation", "position"],

    "strokeOpacity": 1,
    "strokeStyle": "none",
    "fillOpacity": 1,
    "fillStyle": "none",
    "globalAlpha": 1,
    "lineWidth": 1,
    "lineCap": "butt",
    "lineJoin": "miter",
    "miterLimit": 10,
    "shadowOffsetX": 0,
    "shadowOffsetY": 0,
    "shadowBlur": 0,
    "shadowColor": "none",
    "globalCompositeOperation": "src",

    constructor: function (SvgSurface) {
        this.surface = SvgSurface;
        this.status = [];
        this.matrix = new Ext.draw.Matrix();
        this.path = null;
        this.clear();
    },

    clear: function () {
        this.group = this.surface.mainGroup;
        this.position = 0;
        this.path = null;
    },

    /**
     * @private
     * @param tag
     * @return {*}
     */
    getElement: function (tag) {
        return this.surface.getSvgElement(this.group, tag, this.position++);
    },

    save: function () {
        var toSave = this.toSave,
            obj = {},
            group = this.getElement('g');

        for (var i = 0; i < toSave.length; i++) {
            if (toSave[i] in this) {
                obj[toSave[i]] = this[toSave[i]];
            }
        }
        this.position = 0;
        obj.matrix = this.matrix.clone();
        this.status.push(obj);
        this.group = group;
    },

    restore: function () {
        var toSave = this.toSave,
            obj = this.status.pop(),
            children = this.group.dom.childNodes;
        while (children.length > this.position) {
            Ext.fly(children[children.length - 1]).destroy();
        }
        for (var i = 0; i < toSave.length; i++) {
            if (toSave[i] in obj) {
                this[toSave[i]] = obj[toSave[i]];
            } else {
                delete this[toSave[i]];
            }
        }

        this.setTransform.apply(this, obj.matrix.elements);
        this.group = this.group.getParent();
    },

    transform: function (xx, yx, xy, yy, dx, dy) {
        if (this.path) {
            var inv = Ext.draw.Matrix.fly([xx, yx, xy, yy, dx, dy]).inverse();
            this.path.transform(inv);
        }
        this.matrix.append(xx, yx, xy, yy, dx, dy);
    },

    setTransform: function (xx, yx, xy, yy, dx, dy) {
        if (this.path) {
            this.path.transform(this.matrix);
        }
        this.matrix.reset();
        this.transform(xx, yx, xy, yy, dx, dy);
    },

    beginPath: function () {
        this.path = new Ext.draw.Path();
    },

    moveTo: function (x, y) {
        if (!this.path) {
            this.beginPath();
        }
        this.path.moveTo(x, y);
        this.path.element = null;
    },

    lineTo: function (x, y) {
        if (!this.path) {
            this.beginPath();
        }
        this.path.lineTo(x, y);
        this.path.element = null;
    },

    rect: function (x, y, width, height) {
        this.moveTo(x, y);
        this.lineTo(x + width, y);
        this.lineTo(x + width, y + height);
        this.lineTo(x, y + height);
        this.closePath();
    },

    strokeRect: function (x, y, width, height) {
        this.beginPath();
        this.rect(x, y, width, height);
        this.stroke();
    },

    fillRect: function (x, y, width, height) {
        this.beginPath();
        this.rect(x, y, width, height);
        this.fill();
    },

    closePath: function () {
        if (!this.path) {
            this.beginPath();
        }
        this.path.closePath();
        this.path.element = null;
    },

    arcSvg: function (r1, r2, rotation, large, swipe, x2, y2) {
        if (!this.path) {
            this.beginPath();
        }
        this.path.arcSvg(r1, r2, rotation, large, swipe, x2, y2);
        this.path.element = null;
    },

    arc: function (x, y, radius, startAngle, endAngle, anticlockwise) {
        if (!this.path) {
            this.beginPath();
        }
        this.path.arc(x, y, radius, startAngle, endAngle, anticlockwise);
        this.path.element = null;
    },

    ellipse: function (x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise) {
        if (!this.path) {
            this.beginPath();
        }
        this.path.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise);
        this.path.element = null;
    },

    arcTo: function (x1, y1, x2, y2, radiusX, radiusY, rotation) {
        if (!this.path) {
            this.beginPath();
        }
        this.path.arcTo(x1, y1, x2, y2, radiusX, radiusY, rotation);
        this.path.element = null;
    },

    bezierCurveTo: function (x1, y1, x2, y2, x3, y3) {
        if (!this.path) {
            this.beginPath();
        }
        this.path.bezierCurveTo(x1, y1, x2, y2, x3, y3);
        this.path.element = null;
    },

    strokeText: function (text, x, y) {
        text = String(text);
        if (this.strokeStyle) {
            var element = this.getElement('text'),
                tspan = this.surface.getSvgElement(element, 'tspan', 0);
            this.surface.setElementAttributes(element, {
                "x": x,
                "y": y,
                "transform": this.matrix.toSvg(),
                "stroke": this.strokeStyle,
                "fill": "none",
                "opacity": this.globalAlpha,
                "stroke-opacity": this.strokeOpacity,
                "style": "font: " + this.font
            });
            if (tspan.dom.firstChild) {
                tspan.dom.removeChild(tspan.dom.firstChild);
            }
            tspan.appendChild(document.createTextNode(Ext.String.htmlDecode(text)));
        }
    },

    fillText: function (text, x, y) {
        text = String(text);
        if (this.fillStyle) {
            var element = this.getElement('text'),
                tspan = this.surface.getSvgElement(element, 'tspan', 0);
            this.surface.setElementAttributes(element, {
                "x": x,
                "y": y,
                "transform": this.matrix.toSvg(),
                "fill": this.fillStyle,
                "opacity": this.globalAlpha,
                "fill-opacity": this.fillOpacity,
                "style": "font: " + this.font
            });
            if (tspan.dom.firstChild) {
                tspan.dom.removeChild(tspan.dom.firstChild);
            }
            this.surface.setElementAttributes(tspan, {
                "alignment-baseline": "middle",
                "baseline-shift": "-50%"
            });
            tspan.appendChild(document.createTextNode(Ext.String.htmlDecode(text)));
        }
    },

    drawImage: function (image, sx, sy, sw, sh, dx, dy, dw, dh) {
        var me = this,
            element = me.getElement('image'),
            x = sx, y = sy,
            width = typeof sw === 'undefined' ? image.width : sw,
            height = typeof sh === 'undefined' ? image.height : sh,
            viewBox = null;
        if (typeof dh !== 'undefined') {
            viewBox = sx + " " + sy + " " + sw + " " + sh;
            x = dx;
            y = dy;
            width = dw;
            height = dh;
        }
        element.dom.setAttributeNS("http:/" + "/www.w3.org/1999/xlink", "href", image.src);
        me.surface.setElementAttributes(element, {
            viewBox: viewBox,
            x: x,
            y: y,
            width: width,
            height: height,
            opacity: me.globalAlpha,
            transform: me.matrix.toSvg()
        });
    },

    fill: function () {
        if (!this.path) {
            return;
        }
        if (this.fillStyle) {
            var path,
                element = this.path.element;
            if (!element) {
                path = this.path.toString();
                element = this.path.element = this.getElement('path');
                this.surface.setElementAttributes(element, {
                    "d": path,
                    "transform": this.matrix.toSvg()
                });
            }
            this.surface.setElementAttributes(element, {
                "fill": this.fillStyle,
                "fill-opacity": this.fillOpacity * this.globalAlpha
            });
        }
    },

    stroke: function () {
        if (!this.path) {
            return;
        }
        if (this.strokeStyle) {
            var path,
                element = this.path.element;
            if (!element) {
                path = this.path.toString();
                element = this.path.element = this.getElement('path');
                this.surface.setElementAttributes(element, {
                    "fill": "none",
                    "d": path,
                    "transform": this.matrix.toSvg()
                });
            }
            this.surface.setElementAttributes(element, {
                "stroke": this.strokeStyle,
                "stroke-linecap": this.lineCap,
                "stroke-linejoin": this.lineJoin,
                "stroke-width": this.lineWidth,
                "stroke-opacity": this.strokeOpacity * this.globalAlpha
            });
        }
    },

    /**
     * @protected
     *
     * Note: After the method guarantees the transform matrix will be inverted.
     * @param ctx
     * @param attr
     */
    fillStroke: function (attr) {
        var ctx = this,
            fillStyle = ctx.fillStyle,
            strokeStyle = ctx.strokeStyle,
            fillOpacity = ctx.fillOpacity,
            strokeOpacity = ctx.strokeOpacity;

        if (!attr.transformFillStroke) {
            attr.inverseMatrix.toContext(ctx);
        }

        if (fillStyle && fillOpacity !== 0) {
            ctx.fill();
        }

        if (strokeStyle && strokeOpacity !== 0) {
            ctx.stroke();
        }
    },

    appendPath: function (path) {
        this.path = path.clone();
    },

    createLinearGradient: function (x0, y0, x1, y1) {
        var element = this.surface.getNextDef('linearGradient');
        this.surface.setElementAttributes(element, {
            "x1": x0,
            "y1": y0,
            "x2": x1,
            "y2": y1,
            "gradientUnits": "userSpaceOnUse"
        });
        return new Ext.draw.engine.SvgContext.Gradient(this, this.surface, element);
    },

    createRadialGradient: function (x0, y0, r0, x1, y1, r1) {
        var element = this.surface.getNextDef('radialGradient');
        this.surface.setElementAttributes(element, {
            "fx": x0,
            "fy": y0,
            "cx": x1,
            "cy": y1,
            "r": r1,
            "gradientUnits": "userSpaceOnUse"
        });
        return new Ext.draw.engine.SvgContext.Gradient(this, this.surface, element, r1 / r0);
    }
});

Ext.define("Ext.draw.engine.SvgContext.Gradient", {
    constructor: function (ctx, surface, element, compression) {
        this.ctx = ctx;
        this.surface = surface;
        this.element = element;
        this.position = 0;
        this.compression = compression || 0;
    },

    addColorStop: function (offset, color) {
        var stop = this.surface.getSvgElement(this.element, 'stop', this.position++),
            compression = this.compression;
        this.surface.setElementAttributes(stop, {
            "offset": (((1 - compression) * offset + compression) * 100).toFixed(2) + '%',
            "stop-color": color
        });
    },

    toString: function () {
        return 'url(#' + this.element.getId() + ')';
    }
});
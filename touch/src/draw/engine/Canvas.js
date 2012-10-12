/**
 * @class
 * @extends Ext.draw.Surface
 *
 * Provides specific methods to draw with 2D Canvas element.
 */
Ext.define('Ext.draw.engine.Canvas', {
    extend: 'Ext.draw.Surface',
    config: {
        highPrecision: false
    },
    requires: ['Ext.draw.Animator'],
    statics: {
        contextOverrides: {
            fill: function () {
                var fillStyle = this.fillStyle,
                    fillOpacity = this.fillOpacity,
                    rgba = 'rgba(0, 0, 0, 0)',
                    rgba0 = 'rgba(0, 0, 0, 0.0)',
                    alpha = this.globalAlpha;
                if (fillStyle !== rgba && fillStyle !== rgba0 && fillOpacity !== 0) {
                    if (fillOpacity !== 1) {
                        this.globalAlpha = alpha * fillOpacity;
                    }
                    this.__proto__.fill.call(this);
                }
                this.globalAlpha = alpha;
            },

            stroke: function () {
                var strokeStyle = this.strokeStyle,
                    opacity = this.strokeOpacity,
                    rgba = 'rgba(0, 0, 0, 0)',
                    rgba0 = 'rgba(0, 0, 0, 0.0)',
                    alpha = this.globalAlpha;
                if (strokeStyle !== rgba && strokeStyle !== rgba0 && opacity !== 0) {
                    if (opacity !== 1) {
                        this.globalAlpha = alpha * opacity;
                    }
                    this.__proto__.stroke.call(this);
                }
                this.globalAlpha = alpha;
            },

            fillStroke: function (attr, transformFillStroke) {
                var ctx = this,
                    oldShadowColor = ctx.shadowColor,
                    fillStyle = ctx.fillStyle,
                    strokeStyle = ctx.strokeStyle,
                    alpha = ctx.globalAlpha,
                    fillOpacity = ctx.fillOpacity,
                    strokeOpacity = ctx.strokeOpacity,
                    rgba = 'rgba(0, 0, 0, 0)',
                    rgba0 = 'rgba(0, 0, 0, 0.0)';

                if (transformFillStroke === undefined) {
                    transformFillStroke = attr.transformFillStroke;
                }

                if (!transformFillStroke) {
                    attr.inverseMatrix.toContext(ctx);
                }

                if (fillStyle !== rgba && fillStyle !== rgba0 && fillOpacity !== 0) {
                    if (fillOpacity !== 1) {
                        ctx.globalAlpha = alpha * fillOpacity;
                    }
                    ctx.fill();
                    if (oldShadowColor !== rgba) {
                        ctx.shadowColor = rgba;
                    }
                }

                if (strokeStyle !== rgba && strokeStyle !== rgba0 && strokeOpacity !== 0) {
                    if (strokeOpacity) {
                        ctx.globalAlpha = alpha * strokeOpacity;
                    } else if (fillOpacity !== 1) {
                        ctx.globalAlpha = alpha;
                    }
                    ctx.stroke();
                    if (oldShadowColor !== rgba) {
                        ctx.shadowColor = oldShadowColor;
                    }
                }
            },

            ellipse: function (cx, cy, rx, ry, rotation, start, end, anticlockwise) {
                var cos = Math.cos(rotation),
                    sin = Math.sin(rotation);
                this.transform(cos * rx, sin * rx, -sin * ry, cos * ry, cx, cy);
                this.arc(0, 0, 1, start, end, anticlockwise);
                this.transform(
                    cos / rx, -sin / ry,
                    sin / rx, cos / ry,
                    -(cos * cx + sin * cy) / rx, (sin * cx - cos * cy) / ry);
            },

            appendPath: function (path) {
                var me = this,
                    i = 0, j = 0,
                    types = path.types,
                    coords = path.coords,
                    ln = path.types.length;
                me.beginPath();
                for (; i < ln; i++) {
                    switch (types[i]) {
                        case "M":
                            me.moveTo(coords[j], coords[j + 1]);
                            j += 2;
                            break;
                        case "L":
                            me.lineTo(coords[j], coords[j + 1]);
                            j += 2;
                            break;
                        case "C":
                            me.bezierCurveTo(
                                coords[j], coords[j + 1],
                                coords[j + 2], coords[j + 3],
                                coords[j + 4], coords[j + 5]
                            );
                            j += 6;
                            break;
                        case "Z":
                            me.closePath();
                            break;
                        default:
                    }
                }
            }
        }
    },

    splitThreshold: 1800,

    getElementConfig: function () {
        return {
            reference: 'element',
            style: {
                position: 'absolute'
            },
            children: [
                {
                    reference: 'innerElement',
                    style: {
                        width: '100%',
                        height: '100%',
                        position: 'relative'
                    }
                }
            ]
        };
    },

    /**
     * @private
     */
    createCanvas: function () {
        var canvas = Ext.Element.create({
                tag: 'canvas',
                cls: 'x-surface'
            }),
            ctx = canvas.dom.getContext('2d'),
            backingStoreRatio = ctx.webkitBackingStorePixelRatio ||
                ctx.mozBackingStorePixelRatio ||
                ctx.msBackingStorePixelRatio ||
                ctx.oBackingStorePixelRatio ||
                ctx.backingStorePixelRatio || 1;

        this.devicePixelRatio /= backingStoreRatio;

        if (ctx.ellipse) {
            delete Ext.draw.engine.Canvas.contextOverrides.ellipse;
        }

        Ext.apply(ctx, Ext.draw.engine.Canvas.contextOverrides);

        if (this.getHighPrecision()) {
            this.enablePrecisionCompensation(ctx);
        } else {
            this.disablePrecisionCompensation(ctx);
        }

        this.innerElement.appendChild(canvas);
        this.canvases.push(canvas);
        this.contexts.push(ctx);
    },

    initElement: function () {
        this.callSuper();
        this.canvases = [];
        this.contexts = [];
        this.createCanvas();
        this.activeCanvases = 0;
    },

    updateHighPrecision: function (pc) {
        var contexts = this.contexts,
            ln = contexts.length,
            i, context;

        for (i = 0; i < ln; i++) {
            context = contexts[i];
            if (pc) {
                this.enablePrecisionCompensation(context);
            } else {
                this.disablePrecisionCompensation(context);
            }
        }
    },

    precisionMethods: {
        rect: false,
        fillRect: false,
        strokeRect: false,
        clearRect: false,
        moveTo: false,
        lineTo: false,
        arc: false,
        arcTo: false,
        save: false,
        restore: false,
        updatePrecisionCompensate: false,
        setTransform: false,
        transform: false,
        scale: false,
        translate: false,
        rotate: false,
        quadraticCurveTo: false,
        bezierCurveTo: false,
        createLinearGradient: false,
        createRadialGradient: false,
        fillText: false,
        strokeText: false,
        drawImage: false
    },

    disablePrecisionCompensation: function (ctx) {
        var precisionMethods = this.precisionMethods,
            name;

        for (name in precisionMethods) {
            delete ctx[name];
        }

        this.setDirty(true);
    },

    enablePrecisionCompensation: function (ctx) {
        var surface = this,
            xx = 1, yy = 1,
            dx = 0, dy = 0,
            matrix = new Ext.draw.Matrix(),
            transStack = [],
            comp = {},
            originalCtx = ctx.constructor.prototype;

        var override = {
            rect: function (x, y, w, h) {
                return originalCtx.rect.call(this, x * xx + dx, y * yy + dy, w * xx, h * yy);
            },
            fillRect: function (x, y, w, h) {
                this.updatePrecisionCompensateRect();
                originalCtx.fillRect.call(this, x * xx + dx, y * yy + dy, w * xx, h * yy);
                this.updatePrecisionCompensate();
            },
            strokeRect: function (x, y, w, h) {
                this.updatePrecisionCompensateRect();
                originalCtx.strokeRect.call(this, x * xx + dx, y * yy + dy, w * xx, h * yy);
                this.updatePrecisionCompensate();
            },
            clearRect: function (x, y, w, h) {
                return originalCtx.clearRect.call(this, x * xx + dx, y * yy + dy, w * xx, h * yy);
            },
            moveTo: function (x, y) {
                return originalCtx.moveTo.call(this, x * xx + dx, y * yy + dy);
            },
            lineTo: function (x, y) {
                return originalCtx.lineTo.call(this, x * xx + dx, y * yy + dy);
            },
            arc: function (x, y, radius, startAngle, endAngle, anticlockwise) {
                this.updatePrecisionCompensateRect();
                originalCtx.arc.call(this, x * xx + dx, y * xx + dy, radius * xx, startAngle, endAngle, anticlockwise);
                this.updatePrecisionCompensate();
            },
            arcTo: function (x1, y1, x2, y2, radius) {
                this.updatePrecisionCompensateRect();
                originalCtx.arcTo.call(this, x1 * xx + dx, y1 * yy + dy, x2 * xx + dx, y2 * yy + dy, radius * xx);
                this.updatePrecisionCompensate();
            },
            save: function () {
                transStack.push(matrix);
                matrix = matrix.clone();
                return originalCtx.save.call(this);
            },
            restore: function () {
                matrix = transStack.pop();
                originalCtx.restore.call(this);
                this.updatePrecisionCompensate();
            },
            updatePrecisionCompensate: function () {
                matrix.precisionCompensate(surface.devicePixelRatio, comp);
                xx = comp.xx;
                yy = comp.yy;
                dx = comp.dx;
                dy = comp.dy;
                return originalCtx.setTransform.call(this, surface.devicePixelRatio, comp.b, comp.c, comp.d, 0, 0);
            },
            updatePrecisionCompensateRect: function () {
                matrix.precisionCompensateRect(surface.devicePixelRatio, comp);
                xx = comp.xx;
                yy = comp.yy;
                dx = comp.dx;
                dy = comp.dy;
                return originalCtx.setTransform.call(this, surface.devicePixelRatio, comp.b, comp.c, comp.d, 0, 0);
            },
            setTransform: function (x2x, x2y, y2x, y2y, newDx, newDy) {
                matrix.set(x2x, x2y, y2x, y2y, newDx, newDy);
                this.updatePrecisionCompensate();
            },
            transform: function (x2x, x2y, y2x, y2y, newDx, newDy) {
                matrix.append(x2x, x2y, y2x, y2y, newDx, newDy);
                this.updatePrecisionCompensate();
            },
            scale: function (sx, sy) {
                return this.transform(sx, 0, 0, sy, 0, 0);
            },
            translate: function (dx, dy) {
                return this.transform(1, 0, 0, 1, dx, dy);
            },
            rotate: function (radians) {
                var cos = Math.cos(radians),
                    sin = Math.sin(radians);
                return this.transform(cos, sin, -sin, cos, 0, 0);
            },
            quadraticCurveTo: function (cx, cy, x, y) {
                return originalCtx.quadraticCurveTo.call(this,
                    cx * xx + dx,
                    cy * yy + dy,
                    x * xx + dx,
                    y * yy + dy
                );
            },
            bezierCurveTo: function (c1x, c1y, c2x, c2y, x, y) {
                return originalCtx.bezierCurveTo.call(this,
                    c1x * xx + dx,
                    c1y * yy + dy,
                    c2x * xx + dx,
                    c2y * yy + dy,
                    x * xx + dx,
                    y * yy + dy
                );
            },
            createLinearGradient: function (x0, y0, x1, y1) {
                this.updatePrecisionCompensateRect();
                var grad = originalCtx.createLinearGradient.call(this,
                    x0 * xx + dx,
                    y0 * yy + dy,
                    x1 * xx + dx,
                    y1 * yy + dy
                );
                this.updatePrecisionCompensate();
                return grad;
            },
            createRadialGradient: function (x0, y0, r0, x1, y1, r1) {
                this.updatePrecisionCompensateRect();
                var grad = originalCtx.createLinearGradient.call(this,
                    x0 * xx + dx,
                    y0 * xx + dy,
                    r0 * xx,
                    x1 * xx + dx,
                    y1 * xx + dy,
                    r1 * xx
                );
                this.updatePrecisionCompensate();
                return grad;
            },
            fillText: function (text, x, y, maxWidth) {
                originalCtx.setTransform.apply(this, matrix.elements);
                if (typeof maxWidth === 'undefined') {
                    originalCtx.fillText.call(this, text, x, y);
                } else {
                    originalCtx.fillText.call(this, text, x, y, maxWidth);
                }
                this.updatePrecisionCompensate();
            },
            strokeText: function (text, x, y, maxWidth) {
                originalCtx.setTransform.apply(this, matrix.elements);
                if (typeof maxWidth === 'undefined') {
                    originalCtx.strokeText.call(this, text, x, y);
                } else {
                    originalCtx.strokeText.call(this, text, x, y, maxWidth);
                }
                this.updatePrecisionCompensate();
            },
            fill: function () {
                this.updatePrecisionCompensateRect();
                originalCtx.fill.call(this);
                this.updatePrecisionCompensate();
            },
            stroke: function () {
                this.updatePrecisionCompensateRect();
                originalCtx.stroke.call(this);
                this.updatePrecisionCompensate();
            },
            drawImage: function (img_elem, arg1, arg2, arg3, arg4, dst_x, dst_y, dw, dh) {
                switch (arguments.length) {
                    case 3:
                        return originalCtx.drawImage.call(this, img_elem, arg1 * xx + dx, arg2 * yy + dy);
                    case 5:
                        return originalCtx.drawImage.call(this, img_elem, arg1 * xx + dx, arg2 * yy + dy, arg3 * xx, arg4 * yy);
                    case 9:
                        return originalCtx.drawImage.call(this, img_elem, arg1, arg2, arg3, arg4, dst_x * xx + dx, dst_y * yy * dy, dw * xx, dh * yy);
                }
            }
        };
        Ext.apply(ctx, override);
        this.setDirty(true);
        return ctx;
    },

    updateRegion: function (region) {
        this.callSuper([region]);

        var me = this,
            l = Math.floor(region[0]),
            t = Math.floor(region[1]),
            r = Math.ceil(region[0] + region[2]),
            b = Math.ceil(region[1] + region[3]),
            devicePixelRatio = me.devicePixelRatio,
            w = r - l,
            h = b - t,
            splitThreshold = Math.round(me.splitThreshold / devicePixelRatio),
            splits = Math.ceil(w / splitThreshold),
            activeCanvases = me.activeCanvases,
            i, offsetX, dom, leftWidth;

        for (i = 0, offsetX = 0; i < splits; i++, offsetX += splitThreshold) {
            if (i >= me.canvases.length) {
                me.createCanvas();
            }
            dom = me.canvases[i].dom;
            dom.style.left = offsetX + 'px';
            if (h * devicePixelRatio !== dom.height) {
                dom.height = h * devicePixelRatio;
                dom.style.height = h + 'px';
            }
            leftWidth = Math.min(splitThreshold, w - offsetX);
            if (leftWidth * devicePixelRatio !== dom.width) {
                dom.width = leftWidth * devicePixelRatio;
                dom.style.width = leftWidth + 'px';
            }
            me.applyDefaults(me.contexts[i]);
        }

        for (; i < activeCanvases; i++) {
            dom = me.canvases[i].dom;
            dom.width = 0;
            dom.height = 0;
        }
        me.activeCanvases = splits;
        me.clear();
    },

    // Inherited
    clearTransform: function () {
        var me = this,
            activeCanvases = me.activeCanvases,
            i, ctx;

        for (i = 0; i < activeCanvases; i++) {
            ctx = me.contexts[i];
            ctx.translate(-me.splitThreshold * i, 0);
            ctx.scale(me.devicePixelRatio, me.devicePixelRatio);
            me.matrix.toContext(ctx);
        }

    },

    // Inherited
    renderSprite: function (sprite) {
        var me = this,
            region = me._region,
            surfaceMatrix = me.matrix,
            parent = sprite._parent,
            matrix = Ext.draw.Matrix.fly([1, 0, 0, 1, 0, 0]),
            bbox, i, offsetX, ctx, width, left = 0, top, right = region[2], bottom;

        while (parent && (parent !== me)) {
            matrix.prependMatrix(parent.matrix || parent.attr && parent.attr.matrix);
            parent = parent.getParent();
        }
        matrix.prependMatrix(surfaceMatrix);
        bbox = sprite.getBBox();
        if (bbox) {
            bbox = matrix.transformBBox(bbox);
        }

        sprite.preRender(me);

        if (sprite.attr.hidden || sprite.attr.globalAlpha === 0) {
            sprite.setDirty(false);
            return;
        }

        top = 0;
        bottom = top + region[3];

        for (i = 0, offsetX = 0; i < me.activeCanvases; i++, offsetX += me.splitThreshold / me.devicePixelRatio) {
            ctx = me.contexts[i];
            width = Math.min(region[2] - offsetX, me.splitThreshold / me.devicePixelRatio);
            left = offsetX;
            right = left + width;

            if (bbox) {
                if (bbox.x > right ||
                    bbox.x + bbox.width < left ||
                    bbox.y > bottom ||
                    bbox.y + bbox.height < top) {
                    continue;
                }
            }

            sprite.applyTransformations();
            ctx.save();
            // Set attributes to context.
            sprite.useAttributes(ctx);
            // Render shape
            sprite.render(me, ctx, [left, top, width, bottom - top]);
            ctx.restore();
        }
        sprite.setDirty(false);
    },

    applyDefaults: function (ctx) {
        ctx.strokeStyle = 'rgba(0,0,0,0)';
        ctx.fillStyle = 'rgba(0,0,0,0)';
        ctx.textAlign = 'start';
        ctx.textBaseline = 'top';
        ctx.miterLimit = 1;
    },

    // Inherited
    clear: function () {
        var me = this,
            activeCanvases = this.activeCanvases,
            i, canvas, ctx, width, height;
        for (i = 0; i < activeCanvases; i++) {
            canvas = me.canvases[i].dom;
            ctx = me.contexts[i];
            width = canvas.width;
            height = canvas.height;
            if (Ext.os.is.Android && !Ext.os.is.Android4) {
                // TODO: Verify this is the proper check (Chrome)
                // On chrome this is faster:
                //noinspection SillyAssignmentJS
                canvas.width = canvas.width;
                // Fill the gap between surface defaults and canvas defaults
                me.applyDefaults(ctx);
            } else {
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.clearRect(0, 0, width, height);
            }
        }
        me.setDirty(true);
    },

    /**
     * Destroys the Canvas element and prepares it for Garbage Collection.
     */
    destroy: function () {
        var me = this,
            i, ln = me.canvases.length;
        for (i = 0; i < ln; i++) {
            me.contexts[i] = null;
            me.canvases[i].destroy();
            me.canvases[i] = null;
        }
        delete me.contexts;
        delete me.canvases;
        me.callSuper(arguments);
    }
}, function () {
    if (Ext.os.is.Android4 && Ext.browser.is.Chrome) {
        this.prototype.splitThreshold = 3000;
    } else if (Ext.os.is.Android) {
        this.prototype.splitThreshold = 1e10;
    }
});
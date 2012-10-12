/**
 *
 */
Ext.define("Ext.chart.axis.sprite.Axis", {
    extend: 'Ext.draw.sprite.Sprite',
    mixins: {
        markerHolder: "Ext.chart.MarkerHolder"
    },

    requires: ['Ext.draw.sprite.Text'],

    inheritableStatics: {
        def: {
            processors: {
                grid: 'bool',
                axisLine: 'bool',
                minorTicks: 'bool',
                minorTickSize: 'number',
                majorTicks: 'bool',
                majorTickSize: 'number',
                length: 'number',
                startGap: 'number',
                endGap: 'number',
                visibleRange: 'data',
                position: 'enums(left,right,top,bottom,angular,radial)',
                minStepSize: 'number',
                estStepSize: 'number',
                titleOffset: 'number',
                textPadding: 'number',
                min: 'number',
                max: 'number',
                centerX: 'number',
                centerY: 'number',
                radius: 'number',
                baseRotation: 'number',
                data: 'default',
                enlargeEstStepSizeByText: 'bool'
            },

            defaults: {
                grid: false,
                axisLine: true,
                minorTicks: false,
                minorTickSize: 3,
                majorTicks: true,
                majorTickSize: 5,
                length: 0,
                startGap: 0,
                endGap: 0,
                visibleRange: [0, 1],
                position: '',
                minStepSize: 0,
                estStepSize: 42,
                min: 0,
                max: 1,
                centerX: 0,
                centerY: 0,
                radius: 1,
                baseRotation: 0,
                data: null,
                titleOffset: 0,
                textPadding: 5,
                // Override default
                strokeStyle: 'black',
                enlargeEstStepSizeByText: false
            },

            dirtyTriggers: {
                minorTickSize: 'bbox',
                majorTickSize: 'bbox',
                position: 'bbox,layout',
                axisLine: 'bbox,layout',
                min: 'layout',
                max: 'layout',
                length: 'layout',
                minStepSize: 'layout',
                estStepSize: 'layout',
                data: 'layout',
                visibleRange: 'layout',
                enlargeEstStepSizeByText: 'layout'
            },
            updaters: {
                'layout': function () {
                    this.doLayout();
                }
            }
        }
    },

    config: {

        label: null,

        layout: null,

        segmenter: null,

        renderer: null,

        layoutContext: null,

        axis: null
    },

    thickness: 0,

    stepSize: 0,

    getBBox: function () { return null; },

    doLayout: function () {
        var me = this,
            attr = me.attr,
            layout = me.getLayout(),
            context = {
                attr: attr,
                segmenter: me.getSegmenter()
            };
        if (layout) {
            layout.calculateLayout(context);
            me.setLayoutContext(context);
        }
    },

    iterate: function (snaps, fn) {
        var i, position;
        if (snaps.getLabel) {
            if (snaps.min < snaps.from) {
                fn.call(this, snaps.min, snaps.getLabel(snaps.min), -1, snaps);
            }
            for (i = 0; i <= snaps.steps; i++) {
                fn.call(this, snaps.get(i), snaps.getLabel(i), i, snaps);
            }
            if (snaps.max > snaps.to) {
                fn.call(this, snaps.max, snaps.getLabel(snaps.max), snaps.steps + 1, snaps);
            }
        } else {
            if (snaps.min < snaps.from) {
                fn.call(this, snaps.min, snaps.min, -1, snaps);
            }
            for (i = 0; i <= snaps.steps; i++) {
                position = snaps.get(i);
                fn.call(this, position, position, i, snaps);
            }
            if (snaps.max > snaps.to) {
                fn.call(this, snaps.max, snaps.max, snaps.steps + 1, snaps);
            }
        }
    },

    renderTicks: function (surface, ctx, layout, clipRegion) {
        var me = this,
            attr = me.attr,
            docked = attr.position,
            matrix = attr.matrix,
            halfLineWidth = 0.5 * attr.lineWidth,
            xx = matrix.getXX(),
            dx = matrix.getDX(),
            yy = matrix.getYY(),
            dy = matrix.getDY(),
            majorTicks = layout.majorTicks,
            majorTickSize = attr.majorTickSize,
            minorTicks = layout.minorTicks,
            minorTickSize = attr.minorTickSize;

        if (majorTicks) {
            switch (docked) {
                case 'right':
                    me.iterate(majorTicks, function (position, labelText, i) {
                        position = surface.roundPixel(position * yy + dy) + halfLineWidth;
                        ctx.moveTo(0, position);
                        ctx.lineTo(majorTickSize, position);
                    });
                    break;
                case 'left':
                    me.iterate(majorTicks, function (position, labelText, i) {
                        position = surface.roundPixel(position * yy + dy) + halfLineWidth;
                        ctx.moveTo(clipRegion[2] - majorTickSize, position);
                        ctx.lineTo(clipRegion[2], position);
                    });
                    break;
                case 'bottom':
                    me.iterate(majorTicks, function (position, labelText, i) {
                        position = surface.roundPixel(position * xx + dx) - halfLineWidth;
                        ctx.moveTo(position, 0);
                        ctx.lineTo(position, majorTickSize);
                    });
                    break;
                case 'top':
                    me.iterate(majorTicks, function (position, labelText, i) {
                        position = surface.roundPixel(position * xx + dx) - halfLineWidth;
                        ctx.moveTo(position, clipRegion[3]);
                        ctx.lineTo(position, clipRegion[3] - majorTickSize);
                    });
                    break;
                case 'angular':
                    me.iterate(majorTicks, function (position, labelText, i) {
                        position = position / (attr.max + 1) * Math.PI * 2 + attr.baseRotation;
                        ctx.moveTo(
                            attr.centerX + (attr.length) * Math.cos(position),
                            attr.centerY + (attr.length) * Math.sin(position)
                        );
                        ctx.lineTo(
                            attr.centerX + (attr.length + majorTickSize) * Math.cos(position),
                            attr.centerY + (attr.length + majorTickSize) * Math.sin(position)
                        );
                    });
                    break;
            }
        }
    },

    renderLabels: function (surface, ctx, layout, clipRegion) {
        var me = this,
            attr = me.attr,
            halfLineWidth = 0.5 * attr.lineWidth,
            docked = attr.position,
            matrix = attr.matrix,
            textPadding = attr.textPadding,
            xx = matrix.getXX(),
            dx = matrix.getDX(),
            yy = matrix.getYY(),
            dy = matrix.getDY(),
            thickness = 0,
            majorTicks = layout.majorTicks,
            padding = Math.max(attr.majorTickSize, attr.minorTickSize) + attr.lineWidth,
            label = this.getLabel(), font,
            lastLabelText = null,
            textSize = 0, textCount = 0,
            segmenter = layout.segmenter,
            renderer = this.getRenderer(),
            labelInverseMatrix, lastBBox = null, bbox, fly, text;
        if (majorTicks && label && !label.attr.hidden) {
            font = label.attr.font;
            if (ctx.font !== font) {
                ctx.font = font;
            } // This can profoundly improve performance.
            label.setAttributes({translationX: 0, translationY: 0}, true, true);
            label.applyTransformations();
            labelInverseMatrix = label.attr.inverseMatrix.elements.slice(0);
            switch (docked) {
                case 'left':
                    label.setAttributes({
                        textAlign: 'center',
                        textBaseline: 'middle',
                        translationX: surface.roundPixel(clipRegion[2] - padding + dx) - halfLineWidth - me.thickness / 2
                    }, true, true);
                    break;
                case 'right':
                    label.setAttributes({
                        textAlign: 'center',
                        textBaseline: 'middle',
                        translationX: surface.roundPixel(padding + dx) - halfLineWidth + me.thickness / 2
                    }, true, true);
                    break;
                case 'top':
                    label.setAttributes({
                        textAlign: 'center',
                        textBaseline: 'middle',
                        translationY: surface.roundPixel(clipRegion[3] - padding) - halfLineWidth - me.thickness / 2
                    }, true, true);
                    break;
                case 'bottom':
                    label.setAttributes({
                        textAlign: 'center',
                        textBaseline: 'middle',
                        translationY: surface.roundPixel(padding) - halfLineWidth + me.thickness / 2
                    }, true, true);
                    break;
                case 'radial' :
                    label.setAttributes({
                        textAlign: 'center',
                        textBaseline: 'middle',
                        translationX: attr.centerX
                    }, true, true);
                    break;
                case 'angular':
                    label.setAttributes({
                        textAlign: 'center',
                        textBaseline: 'middle',
                        translationY: attr.centerY
                    }, true, true);
                    break;
            }

            // TODO: there are better ways to detect collision.
            if (docked === 'left' || docked === 'right') {
                me.iterate(majorTicks, function (position, labelText, i) {
                    if (labelText === undefined) {
                        return;
                    }
                    text = renderer ? renderer.call(this, labelText, layout, lastLabelText) : segmenter.renderer(labelText, layout, lastLabelText);
                    lastLabelText = labelText;
                    label.setAttributes({
                        text: String(text),
                        translationY: surface.roundPixel(position * yy + dy)
                    }, true, true);
                    label.applyTransformations();
                    thickness = Math.max(thickness, label.getBBox().width + padding);
                    if (thickness <= me.thickness) {
                        fly = Ext.draw.Matrix.fly(label.attr.matrix.elements.slice(0));
                        bbox = fly.prepend.apply(fly, labelInverseMatrix).transformBBox(label.getBBox(true));
                        if (lastBBox && !Ext.draw.Draw.isBBoxIntersect(bbox, lastBBox, textPadding)) {
                            return;
                        }
                        surface.renderSprite(label);
                        lastBBox = bbox;
                        textSize += bbox.height;
                        textCount++;
                    }
                });
            } else if (docked === 'top' || docked === 'bottom') {
                me.iterate(majorTicks, function (position, labelText, i) {
                    if (labelText === undefined) {
                        return;
                    }
                    text = renderer ? renderer.call(this, labelText, layout, lastLabelText) : segmenter.renderer(labelText, layout, lastLabelText);
                    lastLabelText = labelText;
                    label.setAttributes({
                        text: String(text),
                        translationX: surface.roundPixel(position * xx + dx)
                    }, true, true);
                    label.applyTransformations();
                    thickness = Math.max(thickness, label.getBBox().height + padding);
                    if (thickness <= me.thickness) {
                        fly = Ext.draw.Matrix.fly(label.attr.matrix.elements.slice(0));
                        bbox = fly.prepend.apply(fly, labelInverseMatrix).transformBBox(label.getBBox(true));
                        if (lastBBox && !Ext.draw.Draw.isBBoxIntersect(bbox, lastBBox, textPadding)) {
                            return;
                        }
                        surface.renderSprite(label);
                        lastBBox = bbox;
                        textSize += bbox.width;
                        textCount++;
                    }
                });
            } else if (docked === 'radial') {
                me.iterate(majorTicks, function (position, labelText, i) {
                    if (labelText === undefined) {
                        return;
                    }
                    text = renderer ? renderer.call(this, labelText, layout, lastLabelText) : segmenter.renderer(labelText, layout, lastLabelText);
                    lastLabelText = labelText;
                    if (typeof text !== 'undefined') {
                        label.setAttributes({
                            text: String(text),
                            translationY: attr.centerY - surface.roundPixel(position) / attr.max * attr.length
                        }, true, true);
                        label.applyTransformations();
                        bbox = label.attr.matrix.transformBBox(label.getBBox(true));
                        if (lastBBox && !Ext.draw.Draw.isBBoxIntersect(bbox, lastBBox)) {
                            return;
                        }
                        surface.renderSprite(label);
                        lastBBox = bbox;
                        textSize += bbox.width;
                        textCount++;
                    }
                });
            } else if (docked === 'angular') {
                me.iterate(majorTicks, function (position, labelText, i) {
                    if (labelText === undefined) {
                        return;
                    }
                    text = renderer ? renderer.call(this, labelText, layout, lastLabelText) : segmenter.renderer(labelText, layout, lastLabelText);
                    lastLabelText = labelText;

                    if (typeof text !== 'undefined') {
                        var angle = position / (attr.max + 1) * Math.PI * 2 + attr.baseRotation;
                        label.setAttributes({
                            text: String(text),
                            translationX: attr.centerX + (attr.length + 10) * Math.cos(angle),
                            translationY: attr.centerY + (attr.length + 10) * Math.sin(angle)
                        }, true, true);
                        label.applyTransformations();
                        bbox = label.attr.matrix.transformBBox(label.getBBox(true));
                        if (lastBBox && !Ext.draw.Draw.isBBoxIntersect(bbox, lastBBox)) {
                            return;
                        }
                        surface.renderSprite(label);
                        lastBBox = bbox;
                        textSize += bbox.width;
                        textCount++;
                    }
                });
            }

            if (attr.enlargeEstStepSizeByText && textCount) {
                textSize /= textCount;
                textSize += padding;
                textSize *= 2;
                if (attr.estStepSize < textSize) {
                    attr.estStepSize = textSize;
                }
            }

            if (Math.abs(me.thickness - (thickness)) > 1) {
                me.thickness = thickness;
                attr.bbox.plain.dirty = true;
                attr.bbox.transform.dirty = true;
                me.doThicknessChanged();
            }
        }
    },

    renderAxisLine: function (surface, ctx, layout, clipRegion) {
        var me = this,
            attr = me.attr,
            halfWidth = attr.lineWidth * 0.5,
            docked = attr.position;
        if (attr.axisLine) {
            switch (docked) {
                case 'left':
                    ctx.moveTo(clipRegion[2] - halfWidth, -attr.endGap);
                    ctx.lineTo(clipRegion[2] - halfWidth, attr.length + attr.startGap);
                    break;
                case 'right':
                    ctx.moveTo(halfWidth, -attr.endGap);
                    ctx.lineTo(halfWidth, attr.length + attr.startGap);
                    break;
                case 'bottom':
                    ctx.moveTo(-attr.startGap, halfWidth);
                    ctx.lineTo(attr.length + attr.endGap, halfWidth);
                    break;
                case 'top':
                    ctx.moveTo(-attr.startGap, clipRegion[3] - halfWidth);
                    ctx.lineTo(attr.length + attr.endGap, clipRegion[3] - halfWidth);
                    break;
                case 'angular':
                    ctx.moveTo(attr.centerX + attr.length, attr.centerY);
                    ctx.arc(attr.centerX, attr.centerY, attr.length, 0, Math.PI * 2, true);
                    break;
            }
        }
    },

    renderGridLines: function (surface, ctx, layout, clipRegion) {
        var me = this,
            attr = me.attr,
            matrix = attr.matrix,
            xx = matrix.getXX(),
            yy = matrix.getYY(),
            dx = matrix.getDX(),
            dy = matrix.getDY(),
            position = attr.position,
            majorTicks = layout.majorTicks,
            anchor, j, lastAnchor;
        if (attr.grid) {
            if (majorTicks) {
                if (position === 'left' || position === 'right') {
                    lastAnchor = attr.min * yy + dy;
                    me.iterate(majorTicks, function (position, labelText, i) {
                        anchor = position * yy + dy;
                        me.putMarker('horizontal-' + (i % 2 ? 'odd' : 'even'), {
                            y: anchor,
                            height: lastAnchor - anchor
                        }, j = i, true);
                        lastAnchor = anchor;
                    });
                    j++;
                    anchor = 0;
                    me.putMarker('horizontal-' + (j % 2 ? 'odd' : 'even'), {
                        y: anchor,
                        height: lastAnchor - anchor
                    }, j, true);
                } else if (position === 'top' || position === 'bottom') {
                    lastAnchor = attr.min * xx + dx;
                    me.iterate(majorTicks, function (position, labelText, i) {
                        anchor = position * xx + dx;
                        me.putMarker('vertical-' + (i % 2 ? 'odd' : 'even'), {
                            x: anchor,
                            width: lastAnchor - anchor
                        }, j = i, true);
                        lastAnchor = anchor;
                    });
                    j++;
                    anchor = attr.length;
                    me.putMarker('vertical-' + (j % 2 ? 'odd' : 'even'), {
                        x: anchor,
                        width: lastAnchor - anchor
                    }, j, true);
                } else if (position === 'radial') {
                    me.iterate(majorTicks, function (position, labelText, i) {
                        anchor = position / attr.max * attr.length;
                        me.putMarker('angular-' + (i % 2 ? 'odd' : 'even'), {
                            scalingX: anchor,
                            scalingY: anchor
                        }, i, true);
                        lastAnchor = anchor;
                    });
                } else if (position === 'angular') {
                    me.iterate(majorTicks, function (position, labelText, i) {
                        anchor = position / (attr.max + 1) * Math.PI * 2 + attr.baseRotation;
                        me.putMarker('radial-' + (i % 2 ? 'odd' : 'even'), {
                            rotationRads: anchor,
                            rotationCenterX: 0,
                            rotationCenterY: 0,
                            scalingX: attr.length,
                            scalingY: attr.length
                        }, i, true);
                        lastAnchor = anchor;
                    });
                }
            }
        }
    },

    doThicknessChanged: function () {
        var axis = this.getAxis();
        if (axis) {
            axis.onThicknessChanged();
        }
    },

    render: function (surface, ctx, clipRegion) {
        var me = this,
            layout = me.getLayoutContext();
        if (layout) {
            ctx.beginPath();
            me.renderTicks(surface, ctx, layout, clipRegion);
            me.renderAxisLine(surface, ctx, layout, clipRegion);
            me.renderGridLines(surface, ctx, layout, clipRegion);
            ctx.stroke();
            me.renderLabels(surface, ctx, layout, clipRegion);
        }
    }
});
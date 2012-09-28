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
                labelInSpan: 'bool',
                minorTicks: 'bool',
                minorTickSize: 'number',
                majorTicks: 'bool',
                majorTickSize: 'number',
                length: 'number',
                startGap: 'number',
                endGap: 'number',
                visibleRange: 'data',
                position: 'string',
                minStepSize: 'number',
                estStepSize: 'number',
                titleOffset: 'number',
                min: 'number',
                max: 'number',
                data: 'default',
                enlargeEstStepSizeByText: 'bool'
            },

            defaults: {
                grid: false,
                axisLine: true,
                labelInSpan: false,
                minorTicks: false,
                minorTickSize: 3,
                majorTicks: true,
                majorTickSize: 5,
                length: 0,
                startGap: 0,
                endGap: 0,
                visibleRange: [0, 1],
                position: 'left',
                minStepSize: 0,
                estStepSize: 42,
                min: 0,
                max: 1,
                data: null,
                titleOffset: 0,
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

    iterate: function (snaps) {
        var start = snaps.min < snaps.from ? -1 : 0,
            stop = snaps.max > snaps.to ? snaps.steps + 1 : snaps.steps,
            iterator = {
                current: start,
                hasNext: function () {
                    return this.current <= stop;
                },
                get: function () {
                    if (this.current < 0) {
                        return snaps.min;
                    }
                    if (this.current > snaps.steps) {
                        return snaps.max;
                    }
                    return snaps.get(this.current);
                },
                step: function () {
                    this.current++;
                }
            };
        if (snaps.getLabel) {
            iterator.getLabel = function () {
                if (this.current < 0) {
                    return snaps.getLabel(snaps.min);
                }
                if (this.current > snaps.steps) {
                    return snaps.getLabel(snaps.max);
                }
                return snaps.getLabel(this.current);
            };
        } else {
            iterator.getLabel = iterator.get;
        }
        return iterator;
    },

    renderTicks: function (surface, ctx, layout, clipRegion) {
        var me = this,
            attr = me.attr,
            docked = attr.position,
            matrix = attr.matrix,
            halfLineWidth = 0.5 * (attr.lineWidth || 1),
            xx = matrix.getXX(),
            dx = matrix.getDX(),
            yy = matrix.getYY(),
            dy = matrix.getDY(),
            majorTicks = layout.majorTicks,
            majorTickSize = attr.majorTickSize,
            minorTicks = layout.minorTicks,
            minorTickSize = attr.minorTickSize,
            i, step, it, position, ln;

        if (majorTicks) {
            switch (docked) {
                case 'right':
                    for (it = me.iterate(majorTicks); it.hasNext(); it.step()) {
                        position = surface.roundPixel(it.get() * yy + dy) - halfLineWidth;
                        ctx.moveTo(0, position);
                        ctx.lineTo(majorTickSize, position);
                    }
                    break;
                case 'left':
                    for (it = me.iterate(majorTicks); it.hasNext(); it.step()) {
                        position = surface.roundPixel(it.get() * yy + dy) - halfLineWidth;
                        ctx.moveTo(clipRegion[2] - 1 - majorTickSize, position);
                        ctx.lineTo(clipRegion[2] - 1, position);
                    }
                    break;
                case 'bottom':
                    for (it = me.iterate(majorTicks); it.hasNext(); it.step()) {
                        position = surface.roundPixel(it.get() * xx + dx) - halfLineWidth;
                        ctx.moveTo(position, 0);
                        ctx.lineTo(position, majorTickSize);
                    }
                    break;
                case 'top':
                    for (it = me.iterate(majorTicks); it.hasNext(); it.step()) {
                        position = surface.roundPixel(it.get() * xx + dx) - halfLineWidth;
                        ctx.moveTo(position, clipRegion[3] - 1);
                        ctx.lineTo(position, clipRegion[3] - 1 - majorTickSize);
                    }
                    break;
            }
        }
    },

    renderLabels: function (surface, ctx, layout, clipRegion) {
        var me = this,
            attr = me.attr,
            halfLineWidth = 0.5 * (attr.lineWidth || 1),
            titleOffset = attr.titleOffset,
            docked = attr.position,
            matrix = attr.matrix,
            xx = matrix.getXX(),
            dx = matrix.getDX(),
            yy = matrix.getYY(),
            dy = matrix.getDY(),
            thickness = 0,
            majorTicks = layout.majorTicks,
            vertical = docked === 'left' || docked === 'right',
            padding = Math.max(attr.majorTickSize || 0, attr.minorTickSize || 0),
            label = this.getLabel(), font,
            labelText,
            textSize = 0, textCount = 0,
            segmenter = layout.segmenter,
            renderer = this.getRenderer() || function (x) {return x + '';},
            labelInverseMatrix, lastBBox = null, bbox, fly, text,
            it, position;

        if (majorTicks && label && !label.attr.hidden) {
            font = label.attr.font;
            if (ctx.font !== font) {
                ctx.font = font;
            } // This can profoundly improve performance.
            label.setAttributesCanonical({translationX: 0, translationY: 0});
            label.applyTransformations();
            labelInverseMatrix = label.attr.inverseMatrix.elements.slice(0);
            switch (docked) {
                case 'left':
                    label.setAttributesCanonical({
                        textAlign: 'center',
                        textBaseline: 'middle',
                        translationX: surface.roundPixel(clipRegion[2] - 1 - padding + dx) - halfLineWidth - me.thickness / 2
                    });
                    break;
                case 'right':
                    label.setAttributesCanonical({
                        textAlign: 'center',
                        textBaseline: 'middle',
                        translationX: surface.roundPixel(padding + dx) - halfLineWidth + me.thickness / 2
                    });
                    break;
                case 'top':
                    label.setAttributesCanonical({
                        textAlign: 'center',
                        textBaseline: 'middle',
                        translationY: surface.roundPixel(clipRegion[3] - 1 - padding) - halfLineWidth - me.thickness / 2
                    });
                    break;
                case 'bottom':
                    label.setAttributesCanonical({
                        textAlign: 'center',
                        textBaseline: 'middle',
                        translationY: surface.roundPixel(padding) - halfLineWidth + me.thickness / 2
                    });
                    break;
            }

            // TODO: there are better ways to detect collision.
            if (vertical) {
                for (it = this.iterate(majorTicks); it.hasNext(); it.step()) {
                    position = it.get();
                    labelText = it.getLabel();
                    if (labelText === undefined) {
                        continue;
                    }
                    text = renderer.call(this, segmenter.renderer(labelText, layout), layout);
                    label.setAttributesCanonical({
                        text: text ? text.toString() : '',
                        translationY: surface.roundPixel(position * yy + dy)
                    });
                    label.applyTransformations();
                    thickness = Math.max(thickness, label.getBBox().width + padding);
                    if (thickness <= me.thickness) {
                        fly = Ext.draw.Matrix.fly(label.attr.matrix.elements.slice(0));
                        bbox = fly.prepend.apply(fly, labelInverseMatrix).transformBBox(label.getBBox(true));
                        if (lastBBox && !Ext.draw.Draw.isBBoxIntersect(bbox, lastBBox)) {
                            continue;
                        }
                        surface.renderSprite(label);
                        lastBBox = bbox;
                        textSize += bbox.height;
                        textCount++;
                    }
                }
            } else {
                for (it = this.iterate(majorTicks); it.hasNext(); it.step()) {
                    position = it.get();
                    labelText = it.getLabel();
                    if (labelText === undefined) {
                        continue;
                    }
                    text = renderer.call(this, segmenter.renderer(labelText, layout), layout);
                    label.setAttributesCanonical({
                        text: text ? text.toString() : '',
                        translationX: surface.roundPixel(position * xx + dx)
                    });
                    label.applyTransformations();
                    thickness = Math.max(thickness, label.getBBox().height + padding);
                    if (thickness <= me.thickness) {
                        fly = Ext.draw.Matrix.fly(label.attr.matrix.elements.slice(0));
                        bbox = fly.prepend.apply(fly, labelInverseMatrix).transformBBox(label.getBBox(true));
                        if (lastBBox && !Ext.draw.Draw.isBBoxIntersect(bbox, lastBBox)) {
                            continue;
                        }
                        surface.renderSprite(label);
                        lastBBox = bbox;
                        textSize += bbox.width;
                        textCount++;
                    }
                }
            }

            if (attr.enlargeEstStepSizeByText && textCount) {
                textSize /= textCount;
                textSize += padding;
                textSize *= 2;
                if (attr.estStepSize < textSize) {
                    attr.estStepSize = textSize;
                }
            }

            if (me.thickness !== thickness) {
                me.thickness = thickness;
                attr.bbox.plain.dirty = true;
                attr.bbox.transform.dirty = true;
                me.doThicknessChanged();
            }
        }
    },

    doThicknessChanged: function () {
        var axis = this.getAxis();
        if (axis) {
            axis.onThicknessChanged();
        }
    },

    renderAxisLine: function (surface, ctx, layout, clipRegion) {
        var me = this,
            attr = me.attr,
            docked = attr.position;
        if (attr.axisLine) {
            switch (docked) {
                case 'left':
                    ctx.moveTo(clipRegion[2] - 1.5, -attr.endGap);
                    ctx.lineTo(clipRegion[2] - 1.5, attr.length + attr.startGap);
                    break;
                case 'right':
                    ctx.moveTo(0.5, -attr.endGap);
                    ctx.lineTo(0.5, attr.length + attr.startGap);
                    break;
                case 'bottom':
                    ctx.moveTo(-attr.startGap, 0.5);
                    ctx.lineTo(attr.length + attr.endGap, 0.5);
                    break;
                case 'top':
                    ctx.moveTo(-attr.startGap, clipRegion[3] - 1.5);
                    ctx.lineTo(attr.length + attr.endGap, clipRegion[3] - 1.5);
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
            i, it, anchor, lastAnchor;
        if (attr.grid) {
            if (majorTicks) {
                if (position === 'left' || position === 'right') {
                    lastAnchor = attr.min * yy + dy;
                    for (i = 0, it = me.iterate(majorTicks); it.hasNext(); it.step(), i++) {
                        anchor = it.get() * yy + dy;
                        me.putMarker('horizontal', {
                            y: anchor,
                            height: lastAnchor - anchor
                        }, i);
                        lastAnchor = anchor;
                    }
                } else {
                    lastAnchor = attr.min * xx + dx;
                    for (i = 0, it = me.iterate(majorTicks); it.hasNext(); it.step(), i++) {
                        anchor = it.get() * xx + dx;
                        me.putMarker('vertical', {
                            x: anchor,
                            width: lastAnchor - anchor
                        }, i);
                        lastAnchor = anchor;
                    }
                }
            }
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
/**
 * @class Ext.chart.series.Cartesian
 * @extends Ext.chart.series.Series
 *
 * Common base class for series implementations which plot values using x/y coordinates.
 *
 * @constructor
 */
Ext.define('Ext.chart.series.Cartesian', {
    extend: 'Ext.chart.series.Series',
    config: {
        /**
         * The field used to access the x axis value from the items from the data
         * source.
         *
         * @cfg {String} xField
         */
        xField: null,

        /**
         * The field used to access the y-axis value from the items from the data
         * source.
         *
         * @cfg {String} yField
         */
        yField: null,

        xAxis: null,
        yAxis: null
    },

    fieldCategoryX: ['X'],
    fieldCategoryY: ['Y'],

    getFields: function (fieldCategory) {
        var me = this,
            fields = [], fieldsItem,
            i, ln;
        for (i = 0, ln = fieldCategory.length; i < ln; i++) {
            fieldsItem = me['get' + fieldCategory[i] + 'Field']();
            fields.push(fieldsItem);
        }
        return fields;
    },

    onAxesChanged: function (chart) {
        var me = this,
            axes, axis,
            xField = me.getFields(me.fieldCategoryX),
            yField = me.getFields(me.fieldCategoryY),
            i, ln, j, ln2,
            category;

        axes = chart.getAxes();

        // TODO: consider more.
        for (i = 0, ln = axes.length; i < ln; i++) {
            axis = axes[i];
            if (!axis.isCartesian) {
                return;
            }
            category = axis.getCategory();
            if (category === 'Y') {
                for (j = 0, ln2 = yField.length; j < ln2; j++) {
                    if (axis.fieldsMap[yField[j]]) {
                        me.setYAxis(axis);
                        break;
                    }
                }
            } else {
                for (j = 0, ln2 = xField.length; j < ln2; j++) {
                    if (axis.fieldsMap[xField[j]]) {
                        me.setXAxis(axis);
                        break;
                    }
                }
            }
        }
    },

    updateXAxis: function (axis) {
        axis.processData(this);
    },

    updateYAxis: function (axis) {
        axis.processData(this);
    },

    applyStyle: function (style) {
        var cls = Ext.ClassManager.get(Ext.ClassManager.getNameByAlias('sprite.' + this.seriesType));
        if (cls && cls.def) {
            style = cls.def.normalize(style);
        }
        return style;
    },

    updateStyle: function (style) {
        var sprites = this.getSprites(),
            i = 0, ln = sprites.length;
        for (; i < ln; i++) {
            sprites.setAttributes(style);
        }
    },

    /**
     * @private
     * This method will return an array containing data coordinated by a specific axis.
     * @param items
     * @param axis
     * @param field
     * @return {Array}
     */
    coordinateData: function (items, field, axis) {
        var data = [],
            length = items.length,
            layout = axis && axis.getLayout(),
            coord = axis ? function (x, field, idx, items) {
                return layout.getCoordFor(x, field, idx, items);
            } : function (x) { return +x; },
            i;
        for (i = 0; i < length; i++) {
            data[i] = coord(items[i].data[field], field, i, items);
        }
        return data;
    },

    getRangeOfData: function (data, range) {
        var i, length = data.length,
            value, min = range.min, max = range.max;
        for (i = 0; i < length; i++) {
            value = data[i];
            if (value < min) {
                min = value;
            }
            if (value > max) {
                max = value;
            }
        }
        range.min = min;
        range.max = max;
    },

    coordinate: function (direction) {
        var me = this,
            store = me.getActualStore(),
            items = store.getData().items,
            axis = me['get' + direction + 'Axis'](),
            range = {min: Infinity, max: -Infinity},
            fieldCategory = me['fieldCategory' + direction] || [direction],
            fields = me.getFields(fieldCategory),
            i, field, data, style = {},
            sprites = me.getSprites(),
            rangeOffset = direction === 'X' ? 0 : 1;
        if (sprites.length > 0) {
            for (i = 0; i < fieldCategory.length; i++) {
                field = fields[i];
                data = me.coordinateData(items, field, axis);
                me.getRangeOfData(data, range);
                style['data' + fieldCategory[i]] = data;
            }
            me.dataRange[rangeOffset] = range.min;
            me.dataRange[rangeOffset + 2] = range.max;
            style.dataRange = me.dataRange;
            for (i = 0; i < sprites.length; i++) {
                sprites[i].setAttributes(style);
            }
        }
    },

    coordinateX: function () {
        return this.coordinate('X');
    },

    coordinateY: function () {
        return this.coordinate('Y');
    },

    updateLabelData: function () {
        var me = this,
            store = me.getActualStore(),
            items = store.getData().items,
            sprites = me.getSprites(),
            labelField = me.getLabelField(),
            i, ln, labels;
        if (sprites.length > 0 && labelField) {
            labels = [];
            for (i = 0, ln = items.length; i < ln; i++) {
                labels.push(items[i].get(labelField));
            }
            for (i = 0, ln = sprites.length; i < ln; i++) {
                sprites[i].setAttributes({labels: labels});
            }
        }
    },

    processData: function () {
        if (!this.getActualStore()) {
            return;
        }

        var me = this,
            xAxis = me.getXAxis(),
            yAxis = me.getYAxis();

        if (xAxis) {
            xAxis.processData(me);
        } else {
            me.coordinate('X');
        }
        if (yAxis) {
            yAxis.processData(me);
        } else {
            me.coordinate('Y');
        }

        me.updateLabelData();
    },

    getItemForPoint: function (x, y) {
        var me = this,
            sprite = me.getSprites()[0],
            imat = sprite.attr.inverseMatrix,
            dataX = sprite.attr.dataX,
            dataY = sprite.attr.dataY;
        if (dataX && dataY) {
            var positionLB = imat.transformPoint([x - 22, y - 22]),
                positionTR = imat.transformPoint([x + 22, y + 22]),
                left = Math.min(positionLB[0], positionTR[0]),
                right = Math.max(positionLB[0], positionTR[0]),
                top = Math.min(positionLB[1], positionTR[1]),
                bottom = Math.max(positionLB[1], positionTR[1]);
            for (var i = 0; i < dataX.length; i++) {
                if (left < dataX[i] && dataX[i] < right && top < dataY[i] && dataY[i] < bottom) {
                    return {
                        series: this,
                        index: i
                    };
                }
            }
        }
    },

    createSprite: function () {
        var chart = this.getChart(),
            surface = this.getSurface(),
            sprite = surface.add({
                type: this.seriesType,
                id: this.getId() + '-stroke',
                flipXY: chart.getFlipXY(),
                scaling: {
                    centerX: 0,
                    centerY: 0
                }
            });

        sprite.fx.on('animationstart', 'onSpriteAnimationStart', this);
        sprite.fx.on('animationend', 'onSpriteAnimationEnd', this);
        sprite.setAttributes(this.getStyle());
        return sprite;
    },

    getSprites: function () {
        var me = this,
            chart = this.getChart(),
            animation = chart && chart.getAnimate();

        if (!chart) {
            return [];
        }

        if (this.sprites.length) {
            if (animation) {
                this.sprites[0].fx.setConfig(animation);
            }
            return this.sprites;
        }

        var xAxis = me.getXAxis(),
            sprite,
            sprites = this.sprites;

        if (!sprites.length) {
            sprite = this.createSprite();
            if (sprite.setAggregator && xAxis && xAxis.getAggregator) {
                if (xAxis.getAggregator) {
                    sprite.setAggregator({strategy: xAxis.getAggregator()});
                } else {
                    sprite.setAggregator({});
                }
            }
            sprites.push(sprite);
        } else {
            sprite = sprites[0];
        }

        if (animation) {
            sprite.fx.setConfig(animation);
        }

        if (me.getMarker()) {
            sprite.bindMarker('items', me.getMarker());
        }
        return sprites;
    },

    onSpriteAnimationStart: function (sprite) {
        this.fireEvent('animationstart', sprite);
    },

    onSpriteAnimationEnd: function (sprite) {
        this.fireEvent('animationend', sprite);
    },

    getXRange: function () {
        return [this.dataRange[0], this.dataRange[2]];
    },

    getYRange: function () {
        return [this.dataRange[1], this.dataRange[3]];
    }
});
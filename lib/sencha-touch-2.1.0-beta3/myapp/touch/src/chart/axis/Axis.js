/**
 * @class Ext.chart.axis.Axis
 * @extends Ext.chart.axis.Abstract
 *
 * Defines axis for charts. The axis position, type, style can be configured.
 * The axes are defined in an axes array of configuration objects where the type,
 * field, grid and other configuration options can be set. To know more about how
 * to create a Chart please check the Chart class documentation. Here's an example for the axes part:
 * An example of axis for a series (in this case for an area chart that has multiple layers of yFields) could be:
 *
 *     axes: [{
 *         type: 'Numeric',
 *         grid: true,
 *         position: 'left',
 *         fields: ['data1', 'data2', 'data3'],
 *         title: 'Number of Hits',
 *         grid: {
 *             odd: {
 *                 opacity: 1,
 *                 fill: '#ddd',
 *                 stroke: '#bbb',
 *                 lineWidth: 1
 *             }
 *         },
 *         minimum: 0
 *     }, {
 *         type: 'Category',
 *         position: 'bottom',
 *         fields: ['name'],
 *         title: 'Month of the Year',
 *         grid: true,
 *         label: {
 *             rotate: {
 *                 degrees: 315
 *             }
 *         }
 *     }]
 *
 * In this case we use a `Numeric` axis for displaying the values of the Area series and a `Category` axis for displaying the names of
 * the store elements. The numeric axis is placed on the left of the screen, while the category axis is placed at the bottom of the chart.
 * Both the category and numeric axes have `grid` set, which means that horizontal and vertical lines will cover the chart background. In the
 * category axis the labels will be rotated so they can fit the space better.
 */
Ext.define('Ext.chart.axis.Axis', {

    extend: 'Ext.chart.axis.Abstract',

    requires: [
        'Ext.chart.axis.sprite.Axis',
        'Ext.chart.axis.segmenter.*',
        'Ext.chart.axis.layout.*'
    ],

    config: {
        /**
         * @cfg {Number} majorTickSteps
         * If `minimum` and `maximum` are specified it forces the number of major ticks to the specified value.
         */
        majorTickSteps: false,
        /**
         * @cfg {Number} [minorTickSteps=0]
         * The number of small ticks between two major ticks.
         */
        minorTickSteps: false,

        /**
         * @cfg {String} title
         * The title for the Axis
         */
        title: { fontSize: 18, fontFamily: 'Helvetica'},

        /**
         * @cfg {Number} dashSize
         * The size of the dash marker.
         */
        dashSize: 3,

        /**
         * @cfg {Number} minimum
         * The minimum value drawn by the axis. If not set explicitly, the axis
         * minimum will be calculated automatically.
         */
        minimum: NaN,

        /**
         * @cfg {Number} maximum
         * The maximum value drawn by the axis. If not set explicitly, the axis
         * maximum will be calculated automatically.
         */
        maximum: NaN,

        adjustMaximumByMajorUnit: false,

        adjustMinimumByMajorUnit: false,

        /**
         * @cfg {Number} increment
         * Given a minimum and maximum bound for the series to be rendered (that can be obtained
         * automatically or by manually setting `minimum` and `maximum`) tick marks will be added
         * on each `increment` from the minimum value to the maximum one.
         */
        increment: null,

        renderer: null,

        style: null,

        label: { x: 0, y: 0, textBaseline: 'middle', textAlign: 'center', fontSize: 12, fontFamily: 'Helvetica' },

        labelMargin: 4,

        background: null,

        /**
         * @cfg {Number} length
         *
         * Length of the axis position. Equals to the size of inner region on the docking side of this axis.
         */
        length: 0,

        visibleRange: [0, 1],

        layout: 'continuous',

        segmenter: 'numeric',

        grid: false
    },


    titleOffset: 0,

    applyTitle: function (title, oldTitle) {
        var surface;

        if (Ext.isString(title)) {
            title = { text: title };
        }

        if (!oldTitle) {
            oldTitle = Ext.create('sprite.text', title);
            if ((surface = this.getSurface())) {
                surface.add(oldTitle);
            }
        } else {
            oldTitle.setAttributes(title);
        }
        return oldTitle;
    },

    applyLayout: function (layout) {
        // TODO: finish this
        layout = Ext.create('axisLayout.' + layout);
        layout.setAxis(this);
        return layout;
    },

    applySegmenter: function (segmenter) {
        // TODO: finish this
        segmenter = Ext.create('segmenter.' + segmenter);
        segmenter.setAxis(this);
        return segmenter;
    },

    updateMinimum: function () {
        this.range = null;
    },

    updateMaximum: function () {
        this.range = null;
    },

    needHighPrecision: false,
    prevMin: 0,
    prevMax: 1,
    boundSeries: [],
    sprites: null,
    range: null,
    xValues: [],
    yValues: [],
    isCartesian: true,

    constructor: function (config) {
        var me = this;
        me.sprites = [];
        me.callSuper(arguments);
    },

    updateChart: function (newChart, oldChart) {
        if (oldChart) {
            oldChart.un("serieschanged", this.onSeriesChanged, this);
        }
        if (newChart) {
            newChart.on("serieschanged", this.onSeriesChanged, this);
            if (newChart.getSeries()) {
                this.onSeriesChanged(newChart);
            }
            this.getSurface().add(this.getSprites());
            this.getSurface().add(this.getTitle());
        }
    },

    getSurface: function () {
        if (!this.surface) {
            var chart = this.getChart();
            if (!chart) {
                return null;
            }
            this.surface = chart.getSurface(this.getId(), 'axis');
            chart.getSurface('grid').waitFor(this.surface);
        }
        return this.surface;
    },

    applyBackground: function (background) {
        var rect = Ext.ClassManager.getByAlias('sprite.rect');
        return rect.def.normalize(background);
    },

    processData: function () {
        this.getLayout().processData();
        this.range = null;
    },

    getCategory: function () {
        return this.getChart().getCategoryForAxis(this.getPosition());
    },

    isSide: function () {
        var position = this.getPosition();
        return position === 'left' || position === 'right';
    },

    applyFields: function (fields) {
        return [].concat(fields);
    },

    updateFields: function (fields) {
        this.fieldsMap = {};
        for (var i = 0; i < fields.length; i++) {
            this.fieldsMap[fields[i]] = true;
        }
    },

    applyVisibleRange: function (visibleRange, oldVisibleRange) {
        if (visibleRange[0] < 0) {
            visibleRange[1] -= visibleRange[0];
            visibleRange[0] = 0;
        } else if (visibleRange[1] > 1) {
            visibleRange[0] -= visibleRange[1] - 1;
            visibleRange[1] = 1;
        }

        if (oldVisibleRange && visibleRange[0] === oldVisibleRange[0] && visibleRange[1] === oldVisibleRange[1]) {
            return undefined;
        }

        return visibleRange;
    },

    updateVisibleRange: function (visibleRange) {
        this.fireEvent('transformed', this, visibleRange);
    },

    onSeriesChanged: function (chart) {
        var me = this,
            series = chart.getSeries(),
            getAxisMethod = 'get' + me.getCategory() + 'Axis',
            boundSeries = [], i, ln = series.length;
        for (i = 0; i < ln; i++) {
            if (this === series[i][getAxisMethod]()) {
                boundSeries.push(series[i]);
            }
        }

        me.boundSeries = boundSeries;
        me.getLayout().processData();
    },

    applyRange: function (newRange) {
        if (!newRange) {
            return this.dataRange.slice(0);
        } else {
            return [
                newRange[0] === null ? this.dataRange[0] : newRange[0],
                newRange[1] === null ? this.dataRange[1] : newRange[1]
            ];
        }
    },

    getRange: function () {
        var me = this, sprites,
            getRangeMethod = 'get' + me.getCategory() + 'Range';

        if (me.range) {
            return me.range;
        }
        if (!isNaN(me.getMinimum()) && !isNaN(me.getMaximum())) {
            return this.range = [me.getMinimum(), me.getMaximum()];
        }
        var min = Infinity,
            max = -Infinity,
            boundSeries = me.boundSeries,
            series, i, ln;

        // For each series bound to this axis, ask the series for its min/max values
        // and use them to find the overall min/max.
        for (i = 0, ln = boundSeries.length; i < ln; i++) {
            series = boundSeries[i];
            var minMax = series[getRangeMethod]();

            if (minMax) {
                if (minMax[0] < min) {
                    min = minMax[0];
                }
                if (minMax[1] > max) {
                    max = minMax[1];
                }
            }
        }
        if (!isFinite(max)) {
            max = me.prevMax;
        }
        if (!isFinite(min)) {
            min = me.prevMin;
        }
        if (min === max) {
            max += 1;
        }
        if (!isNaN(me.getMinimum())) {
            min = me.getMinimum();
        }
        if (!isNaN(me.getMaximum())) {
            max = me.getMaximum();
        }
        return this.range = [min, max];
    },

    applyStyle: function (style, oldStyle) {
        var cls = Ext.ClassManager.getByAlias('sprite.' + this.seriesType);
        if (cls && cls.def) {
            style = cls.def.normalize(style);
        }
        oldStyle = Ext.apply(oldStyle || {}, style);
        return oldStyle;
    },

    getSprites: function () {
        var me = this,
            range = me.getRange(),
            position = me.getPosition(),
            chart = me.getChart(),
            animation = chart.getAnimate(),
            baseSprite,
            length = me.getLength();

        // If animation is false, then stop animation.
        if (animation === false) {
            animation = {
                duration: 0
            };
        }
        if (range) {
            // If the sprites are not created.
            if (!me.sprites.length) {
                baseSprite = new Ext.chart.axis.sprite.Axis({position: position, axis: me});
                if (position === 'left' || position === 'right') {
                    baseSprite.bindMarker('horizontal', chart.getGridSprite('horizontal'));
                } else {
                    baseSprite.bindMarker('vertical', chart.getGridSprite('vertical'));
                }
                me.sprites.push(baseSprite);
                me.updateTitleSprite();
            } else {
                baseSprite = me.sprites[0];
                baseSprite.fx.setConfig(animation);
            }
            baseSprite.setAttributes(Ext.applyIf({
                min: range[0],
                max: range[1],
                length: length,
                grid: me.getGrid(),
                hidden: me.getHidden(),
                titleOffset: me.titleOffset
            }, me.getStyle()));

            baseSprite.setLayout(me.getLayout());
            baseSprite.setSegmenter(me.getSegmenter());
            baseSprite.setLabel(me.getLabel());

            if (me.getRenderer()) {
                baseSprite.setRenderer(me.getRenderer());
            }
            if (chart.getGridSprite()) {
                baseSprite.bindMarker(chart.getGridSprite());
            }
        }

        return me.sprites;
    },

    updateTitleSprite: function () {
        if (!this.sprites[0]) {
            return;
        }
        var me = this,
            thickness = this.sprites[0].thickness,
            surface = me.getSurface(),
            title = this.getTitle(),
            position = me.getPosition(),
            labelMargin = me.getLabelMargin(),
            length = me.getLength(),
            anchor = surface.roundPixel(length / 2);

        if (title) {
            switch (position) {
                case 'top':
                    title.setAttributesCanonical({
                        x: anchor,
                        y: 0,
                        textBaseline: 'top',
                        textAlign: 'center'
                    });
                    title.applyTransformations();
                    me.titleOffset = title.getBBox().height + labelMargin;
                    break;
                case 'bottom':
                    title.setAttributesCanonical({
                        x: anchor,
                        y: thickness,
                        textBaseline: 'top',
                        textAlign: 'center'
                    });
                    title.applyTransformations();
                    me.titleOffset = title.getBBox().height + labelMargin;
                    break;
                case 'left':
                    title.setAttributes({
                        x: 0,
                        y: anchor,
                        textBaseline: 'top',
                        textAlign: 'center',
                        rotation: {
                            centerX: 0,
                            centerY: anchor,
                            degrees: -90
                        }
                    });
                    title.applyTransformations();
                    me.titleOffset = title.getBBox().width + labelMargin;
                    break;
                case 'right':
                    title.setAttributes({
                        x: thickness,
                        y: anchor,
                        textBaseline: 'bottom',
                        textAlign: 'center',
                        rotation: {
                            centerX: thickness,
                            centerY: anchor,
                            degrees: 90
                        }
                    });
                    title.applyTransformations();
                    me.titleOffset = title.getBBox().width + labelMargin;
                    break;
            }
        }
    },

    getCoordFor: function (value, field, idx, items) {
        return this.getLayout().getCoordFor(value, field, idx, items);
    },

    onThicknessChanged: function () {
        var me = this;
        me.getChart().onThicknessChanged();
    },

    getThickness: function () {
        if (this.getHidden()) {
            return 0;
        }
        return (this.sprites[0] && this.sprites[0].thickness || 1) + this.titleOffset;
    }
});


/**
 * @class
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
    xtype: 'axis',

    mixins: {
        observable: 'Ext.mixin.Observable'
    },

    requires: [
        'Ext.chart.axis.sprite.Axis',
        'Ext.chart.axis.segmenter.*',
        'Ext.chart.axis.layout.*'
    ],

    config: {
        /**
         * @cfg {String} position
         * Where to set the axis. Available options are `left`, `bottom`, `right`, `top`, `radial` and `angular`.
         */
        position: 'bottom',

        /**
         * @cfg {Array} fields
         * An array containing the names of the record fields which should be mapped along the axis.
         */
        fields: [],

        /**
         * @cfg {Object} label
         *
         * The label configuration object for the Axis. This object may include style attributes
         * like `spacing`, `padding`, `font`, and a `renderer` function that receives a string or number and
         * returns a new string with the modified values.
         */
        label: { x: 0, y: 0, textBaseline: 'middle', textAlign: 'center', fontSize: 12, fontFamily: 'Helvetica' },

        /**
         * @cfg {Object} grid
         * The grid configuration object for the Axis style. Can contain `stroke` or `fill` attributes.
         * Also may contain an `odd` or `even` property in which you only style things on odd or even rows.
         * For example:
         *
         *
         *     grid {
         *         odd: {
         *             stroke: '#555'
         *         },
         *         even: {
         *             stroke: '#ccc'
         *         }
         *     }
         */
        grid: false,

        renderer: null,

        chart: null,

        steps: 10,

        style: null,

        labelMargin: 4,

        background: null,

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

        layout: 'continuous',

        segmenter: 'numeric',

        hidden: false,

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

        adjustMaximumByMajorUnit: false,

        adjustMinimumByMajorUnit: false,

        /**
         * @cfg {Number} increment
         * Given a minimum and maximum bound for the series to be rendered (that can be obtained
         * automatically or by manually setting `minimum` and `maximum`) tick marks will be added
         * on each `increment` from the minimum value to the maximum one.
         */
        increment: null,

        /**
         * @cfg {Number} length
         *
         * Length of the axis position. Equals to the size of inner region on the docking side of this axis.
         */
        length: 0,

        /**
         * @cfg {Boolean} [labelInSpan]
         * Draws the labels in the middle of the spans.
         */
        labelInSpan: null,

        visibleRange: [0, 1],

        center: null,

        radius: null,

        rotation: null
    },

    observableType: 'component',

    titleOffset: 0,

    applyRotation: function (rotation) {
        var twoPie = Math.PI * 2;
        return (rotation % twoPie + Math.PI) % twoPie - Math.PI;
    },

    updateRotation: function (rotation) {
        var sprites = this.getSprites(),
            position = this.getPosition();
        if (!this.getHidden() && position === 'angular' && sprites[0]) {
            sprites[0].setAttributes({
                baseRotation: rotation
            });
        }
    },

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

    needHighPrecision: false,
    prevMin: 0,
    prevMax: 1,
    boundSeries: [],
    sprites: null,
    range: null,
    xValues: [],
    yValues: [],

    constructor: function (config) {
        var me = this;
        me.sprites = [];
        this.labels = [];
        this.initConfig(config);
        me.getId();
        me.mixins.observable.constructor.apply(me, arguments);
        Ext.ComponentManager.register(me);
    },

    getAlignment: function () {
        switch (this.getPosition()) {
            case 'left':
            case 'right':
                return "vertical";
            case 'top':
            case 'bottom':
                return "horizontal";
            case 'radial':
                return "radial";
            case 'angular':
                return "angular";
        }
    },

    getGridAlignment: function () {
        switch (this.getPosition()) {
            case 'left':
            case 'right':
                return "horizontal";
            case 'top':
            case 'bottom':
                return "vertical";
            case 'radial':
                return "angular";
            case 'angular':
                return "radial";
        }
    },

    /**
     * @private get the surface for drawing the series sprites
     */
    getSurface: function () {
        if (!this.surface) {
            var chart = this.getChart();
            if (!chart) {
                return null;
            }
            var surface = this.surface = chart.getSurface(this.getId(), 'axis'),
                gridSurface = this.gridSurface = chart.getSurface("grid-" + this.getId(), 'grid'),
                sprites = this.getSprites(),
                sprite = sprites[0],
                grid = this.getGrid(),
                gridAlignment = this.getGridAlignment(),
                gridSprite;
            if (grid) {
                gridSprite = this.gridSpriteEven = new Ext.chart.Markers();
                gridSprite.setTemplate({xclass: 'grid.' + gridAlignment});
                if (Ext.isObject(grid)) {
                    gridSprite.getTemplate().setAttributes(grid);
                    if (Ext.isObject(grid.even)) {
                        gridSprite.getTemplate().setAttributes(grid.even);
                    }
                }
                gridSurface.add(gridSprite);
                sprite.bindMarker(gridAlignment + '-even', gridSprite);

                gridSprite = this.gridSpriteOdd = new Ext.chart.Markers();
                gridSprite.setTemplate({xclass: 'grid.' + gridAlignment});
                if (Ext.isObject(grid)) {
                    gridSprite.getTemplate().setAttributes(grid);
                    if (Ext.isObject(grid.odd)) {
                        gridSprite.getTemplate().setAttributes(grid.odd);
                    }
                }
                gridSurface.add(gridSprite);
                sprite.bindMarker(gridAlignment + '-odd', gridSprite);

                gridSurface.waitFor(surface);
            }
        }
        return this.surface;
    },

    applyPosition: function (pos) {
        return pos.toLowerCase();
    },

    applyLabel: function (newText, oldText) {
        if (!oldText) {
            oldText = new Ext.draw.sprite.Text({});
        }
        oldText.setAttributes(newText);
        return oldText;
    },

    applyLayout: function (layout, oldLayout) {
        // TODO: finish this
        layout = Ext.factory(layout, null, oldLayout, 'axisLayout');
        layout.setAxis(this);
        return layout;
    },

    applySegmenter: function (segmenter, oldSegmenter) {
        // TODO: finish this
        segmenter = Ext.factory(segmenter, null, oldSegmenter, 'segmenter');
        segmenter.setAxis(this);
        return segmenter;
    },

    updateMinimum: function () {
        this.range = null;
    },

    updateMaximum: function () {
        this.range = null;
    },

    hideLabels: function () {
        this.getSprites()[0].setDirty(true);
        this.setLabel({hidden: true});
    },

    showLabels: function () {
        this.getSprites()[0].setDirty(true);
        this.setLabel({hidden: false});
    },

    /**
     * @private Reset the axis to its original state, before any user interaction.
     */
    reset: function () {
        // TODO: finish this
    },

    /**
     * Invokes renderFrame on this axis's surface(s)
     */
    renderFrame: function () {
        this.getSurface().renderFrame();
    },

    updateChart: function (newChart, oldChart) {
        var me = this, surface;
        if (oldChart) {
            oldChart.un("serieschanged", me.onSeriesChanged, me);
        }
        if (newChart) {
            newChart.on("serieschanged", me.onSeriesChanged, me);
            if (newChart.getSeries()) {
                me.onSeriesChanged(newChart);
            }
            me.surface = null;
            surface = me.getSurface();
            surface.add(me.getSprites());
            surface.add(me.getTitle());
        }
    },

    applyBackground: function (background) {
        var rect = Ext.ClassManager.getByAlias('sprite.rect');
        return rect.def.normalize(background);
    },

    processData: function () {
        this.getLayout().processData();
        this.range = null;
    },

    getDirection: function () {
        return this.getChart().getDirectionForAxis(this.getPosition());
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
            getAxisMethod = 'get' + me.getDirection() + 'Axis',
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
        var me = this,
            getRangeMethod = 'get' + me.getDirection() + 'Range';

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

        if (this.getLabelInSpan()) {
            max += 0.5;
            min -= 0.5;
        }

        if (!isNaN(me.getMinimum())) {
            min = me.getMinimum();
        } else {
            me.prevMin = min;
        }

        if (!isNaN(me.getMaximum())) {
            max = me.getMaximum();
        } else {
            me.prevMax = max;
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

    updateCenter: function (center) {
        var sprites = this.getSprites();
        sprites[0].setAttributes({
            centerX: center[0],
            centerY: center[1]
        });
        this.gridSpriteEven.getTemplate().setAttributes({
            translationX: center[0],
            translationY: center[1],
            rotationCenterX: center[0],
            rotationCenterY: center[1]
        });
        this.gridSpriteOdd.getTemplate().setAttributes({
            translationX: center[0],
            translationY: center[1],
            rotationCenterX: center[0],
            rotationCenterY: center[1]
        });
    },

    getSprites: function () {
        if (!this.getChart()) {
            return;
        }
        var me = this,
            range = me.getRange(),
            position = me.getPosition(),
            chart = me.getChart(),
            animation = chart.getAnimate(),
            baseSprite, style,
            gridAlignment = me.getGridAlignment(),
            length = me.getLength();

        // If animation is false, then stop animation.
        if (animation === false) {
            animation = {
                duration: 0
            };
        }
        if (range) {
            style = Ext.applyIf({
                position: position,
                axis: me,
                min: range[0],
                max: range[1],
                length: length,
                grid: me.getGrid(),
                hidden: me.getHidden(),
                titleOffset: me.titleOffset,
                layout: me.getLayout(),
                segmenter: me.getSegmenter(),
                label: me.getLabel()
            }, me.getStyle());

            // If the sprites are not created.
            if (!me.sprites.length) {
                baseSprite = new Ext.chart.axis.sprite.Axis(style);
                baseSprite.fx.setCustomDuration({
                    baseRotation: 0
                });
                me.sprites.push(baseSprite);
                me.updateTitleSprite();
            } else {
                baseSprite = me.sprites[0];
                baseSprite.fx.setConfig(animation);
                baseSprite.setAttributes(style);
                baseSprite.setLayout(me.getLayout());
                baseSprite.setSegmenter(me.getSegmenter());
                baseSprite.setLabel(me.getLabel());
            }

            if (me.getRenderer()) {
                baseSprite.setRenderer(me.getRenderer());
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
                    title.setAttributes({
                        x: anchor,
                        y: labelMargin / 2,
                        textBaseline: 'top',
                        textAlign: 'center'
                    }, true, true);
                    title.applyTransformations();
                    me.titleOffset = title.getBBox().height + labelMargin;
                    break;
                case 'bottom':
                    title.setAttributes({
                        x: anchor,
                        y: thickness + labelMargin,
                        textBaseline: 'top',
                        textAlign: 'center'
                    }, true, true);
                    title.applyTransformations();
                    me.titleOffset = title.getBBox().height + labelMargin;
                    break;
                case 'left':
                    title.setAttributes({
                        x: labelMargin / 2,
                        y: anchor,
                        textBaseline: 'top',
                        textAlign: 'center',
                        rotationCenterX: labelMargin / 2,
                        rotationCenterY: anchor,
                        rotationRads: -Math.PI / 2
                    }, true, true);
                    title.applyTransformations();
                    me.titleOffset = title.getBBox().width + labelMargin;
                    break;
                case 'right':
                    title.setAttributes({
                        x: thickness - labelMargin / 2,
                        y: anchor,
                        textBaseline: 'bottom',
                        textAlign: 'center',
                        rotationCenterX: thickness,
                        rotationCenterY: anchor,
                        rotationRads: Math.PI / 2
                    }, true, true);
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
    },

    // Methods used in ComponentQuery and controller

    //
    getItemId: function () {
        return this.getId();
    },

    getAncestorIds: function () {
        return [this.getChart().getId()];
    },

    isXType: function (xtype) {
        return xtype === 'axis';
    },

    destroy: function () {
        Ext.ComponentManager.unregister(this);
        this.callSuper();
    }
});


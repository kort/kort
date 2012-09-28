/**
 * Series is the abstract class containing the common logic to all chart series. Series includes
 * methods from Labels, Highlights, Tips and Callouts mixins. This class implements the logic of
 * animating, hiding, showing all elements and returning the color of the series to be used as a legend item.
 *
 * ## Listeners
 *
 * The series class supports listeners via the Observable syntax. Some of these listeners are:
 *
 *  - `itemmouseup` When the user interacts with a marker.
 *  - `itemmousedown` When the user interacts with a marker.
 *  - `itemmousemove` When the user interacts with a marker.
 *  - (similar `item*` events occur for many raw mouse and touch events)
 *  - `afterrender` Will be triggered when the animation ends or when the series has been rendered completely.
 *
 * For example:
 *
 *     series: [{
 *         type: 'column',
 *         axis: 'left',
 *         listeners: {
 *             'afterrender': function() {
 *                 console('afterrender');
 *             }
 *         },
 *         xField: 'category',
 *         yField: 'data1'
 *     }]
 *
 */
Ext.define('Ext.chart.series.Series', {

    requires: ['Ext.chart.Markers', 'Ext.chart.label.Label'],

    mixins: {
        observable: 'Ext.mixin.Observable',
        itemEvents: 'Ext.chart.series.ItemEvents'
    },

    /**
     * @property {String} type
     * The type of series. Set in subclasses.
     * @protected
     */
    type: null,

    identifiablePrefix: 'ext-line-',


    config: {
        chart: null,

        /**
         * @cfg {String} title
         * The human-readable name of the series.
         */
        title: null,

        /**
         * @cfg {Function} renderer
         * A function that can be overridden to set custom styling properties to each rendered element.
         * Passes in (sprite, record, attributes, index, store) to the function.
         */
        renderer: function (sprite, record, attributes, index, store) {
            return attributes;
        },

        /**
         * @cfg {Boolean} showInLegend
         * Whether to show this series in the legend.
         */
        showInLegend: true,


        //@private triggerdrawlistener flag
        triggerAfterDraw: false,

        themeStyle: {},

        style: {},

        /**
         * This is cyclic used if series have multiple sprites.
         */
        subStyle: {},

        /**
         * @cfg {Array} colors
         * An array of color values which will be used, in order, as the pie slice fill colors.
         */
        colors: null,

        /**
         *
         */
        store: null,

        /**
         * @private
         */
        actualStore: null,

        /**
         * @cfg {Object} label
         * The style object for labels.
         */
        label: {textBaseline: 'middle', textAlign: 'center', font: '14px Helvetica'},
        
        /**
         * @cfg {Number} labelOverflowPadding
         * Extra distance value for which the labelOverflow listener is triggered.
         */
        labelOverflowPadding: 5,
        
        labelField: null,
        
        marker: null,

        background: null
    },

    sprites: [],


    updateColors: function (colorSet) {
        var subStyle = this.getSubStyle();
        if (!subStyle) {
            this.setSubStyle({});
            subStyle = this.getSubStyle();
        }
        subStyle.fillStyle = colorSet;
    },

    /**
     * @event titlechange
     * Fires when the series title is changed via `{@link #setFieldTitle}`.
     * @param {String} title The new title value.
     * @param {Number} index The index in the collection of titles.
     */

    /**
     * @event beforedraw
     */

    /**
     * @event draw
     */

    /**
     * @event afterdraw
     */

    constructor: function (config) {
        var me = this;
        me.getId();
        me.sprites = [];
        me.dataRange = [0, 0, 1, 1];
        me.mixins.observable.constructor.apply(me, arguments);
        me.mixins.itemEvents.constructor.apply(me, arguments);
        Ext.ComponentManager.register(me);
    },

    applyExcludes: function (excludes) {
        return [].concat(excludes);
    },

    applyStore: function (store) {
        var actualStore = Ext.StoreManager.lookup(store);
        if (!actualStore) {
            Ext.Logger.warn('Store "' + store + '" not found.');
        }
        return actualStore;
    },

    updateActualStore: function (newStore, oldStore) {
        var me = this;
        if (oldStore) {
            oldStore.un('updaterecord', 'onUpdateRecord', me);
            oldStore.un('refresh', 'refresh', me);
        }
        if (newStore) {
            newStore.on('updaterecord', 'onUpdateRecord', me);
            newStore.on('refresh', 'refresh', me);
            me.refresh();
        }
    },

    updateStore: function (newStore) {
        var me = this;

        if (newStore) {
            me.setActualStore(newStore);
        } else {
            if (me.getChart()) {
                me.setActualStore(me.getChart().getStore());
            }
        }
    },

    onStoreChanged: function () {
        var store = this.getActualStore();
        if (store) {
            this.refresh();
        }
    },

    applyBackground: function (background) {
        if (this.getChart()) {
            this.getSurface().setBackground(background);
            return this.getSurface().getBackground();
        } else {
            return background;
        }
    },

    applyStyle: function (style, oldStyle) {
        return Ext.apply(oldStyle || Ext.Object.chain(this.getThemeStyle()), style);
    },

    updateChart: function (newChart, oldChart) {
        var me = this,
            actualStore;
        if (oldChart) {
            oldChart.un("axeschanged", 'onAxesChanged', me);
            me.sprites = [];
        }
        if (newChart) {
            newChart.on("axeschanged", 'onAxesChanged', me);
            if (newChart.getAxes()) {
                me.onAxesChanged(newChart);
            }
            me.setBackground(me.getBackground());
            if (!me.getStore()) {
                me.setActualStore(newChart.getStore());
            } else if (me.getActualStore()) {
                me.refresh();
            }
        }
    },

    onAxesChanged: Ext.emptyFn,

    /**
     * @private get the surface for drawing the series sprites
     */
    getSurface: function () {
        if (this.getChart() && !this.surface) {
            this.surface = this.getChart().getSurface(this.getId() + '-surface', 'series');
        }
        return this.surface;
    },

    getOverlaySurface: function () {
        var me = this;
        if (me.getChart() && !me.overlaySurface) {
            me.overlaySurface = me.getChart().getSurface(me.getId() + '-overlay-surface', 'overlay');
            if (me.getMarker()) {
                me.overlaySurface.add(me.getMarker());
            }
            if (me.getLabel()) {
                me.overlaySurface.add(me.getLabel());
            }
            me.overlaySurface.waitFor(me.getSurface());
        }
        return me.overlaySurface;
    },

    applyMarker: function (marker, oldMarker) {
        if (!marker) {
            if (oldMarker) {
                oldMarker.destroy();
            }
            return null;
        } else {
            if (!oldMarker) {
                oldMarker = new Ext.chart.Markers();
                oldMarker.setTemplate(marker);
                oldMarker.getTemplate().fx.setSpecialDuration({
                    translationX: 0,
                    translationY: 0
                });
            } else {
                oldMarker.setAttributes(marker);
            }
            return oldMarker;
        }
    },

    applyLabel: function (newLabel, oldLabel) {
        if (!oldLabel) {
            oldLabel = new Ext.chart.Markers({});
            oldLabel.setTemplate(new Ext.chart.label.Label(newLabel));
        } else {
            oldLabel.getTemplate().setAttributes(newLabel);
        }
        return oldLabel;
    },

    /**
     * For a given x/y point relative to the Surface, find a corresponding item from this
     * series, if any.
     * @param {Number} x
     * @param {Number} y
     * @return {Object} An object describing the item, or null if there is no matching item. The exact contents of
     * this object will vary by series type, but should always contain at least the following:
     *
     * - {Ext.chart.series.Series} series - the Series object to which the item belongs.
     * - {Object} value - the value(s) of the item's data point.
     * - {Array} point - the x/y coordinates relative to the chart box of a single point
     * for this data item, which can be used as e.g. a tooltip anchor point.
     * - {Ext.draw.sprite.Sprite} sprite - the item's rendering Sprite.
     */
    getItemForPoint: function (x, y) {

    },

    isItemInPoint: function () {
        return false;
    },

    /**
     * Hides all the elements in the series.
     */
    hideAll: Ext.emptyFn,

    /**
     * Shows all the elements in the series.
     */
    showAll: Ext.emptyFn,

    /**
     * Performs drawing of this series.
     */
    getSprites: Ext.emptyFn,

    onUpdateRecord: function () {
        // TODO: do something REALLY FAST.
        this.processData();
    },

    refresh: function () {
        this.processData();
    },

    isXType: function (xtype) {
        return xtype === 'series';
    },

    getItemId: function () {
        return this.getId();
    },

    getStyleByIndex: function (i) {
        var subStyle = this.getSubStyle(),
            result = Ext.Object.chain(this.getStyle());
        for (var name in subStyle) {
            if (Ext.isArray(subStyle[name])) {
                result[name] = subStyle[name][i % subStyle[name].length];
            } else {
                result[name] = subStyle[name];
            }
        }
        return result;
    },

    destroy: function () {
        Ext.ComponentManager.unregister(this);
        var store = this.getStore();
        if (store && store.getAutoDestroy()) {
          Ext.destroy(store);
        }
        this.callSuper();
    }
});

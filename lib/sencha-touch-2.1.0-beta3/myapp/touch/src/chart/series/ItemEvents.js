/**
 * @class Ext.chart.series.ItemEvents
 *
 * This series mixin defines events that occur on a particular series item, and adds default
 * event handlers for detecting and firing those item interaction events.
 *
 */
Ext.define('Ext.chart.series.ItemEvents', {
    extend: 'Ext.mixin.Observable',

    statics: {
        itemEventNames: [
        /**
         * @event itemmousemove
         * Fires when the mouse is moved on a series item.
         * @param {Ext.chart.series.Series} series
         * @param {Object} item
         * @param {Event} event
         */
            'itemmousemove',
        /**
         * @event itemmouseup
         * Fires when a mouseup event occurs on a series item.
         * @param {Ext.chart.series.Series} series
         * @param {Object} item
         * @param {Event} event
         */
            'itemmouseup',
        /**
         * @event itemmousedown
         * Fires when a mousedown event occurs on a series item.
         * @param {Ext.chart.series.Series} series
         * @param {Object} item
         * @param {Event} event
         */
            'itemmousedown',
        /**
         * @event itemmouseover
         * Fires when the mouse enters a series item.
         * @param {Ext.chart.series.Series} series
         * @param {Object} item
         * @param {Event} event
         */
            'itemmouseover',
        /**
         * @event itemmouseout
         * Fires when the mouse exits a series item.
         * @param {Ext.chart.series.Series} series
         * @param {Object} item
         * @param {Event} event
         */
            'itemmouseout',
        /**
         * @event itemclick
         * Fires when a click event occurs on a series item.
         * @param {Ext.chart.series.Series} series
         * @param {Object} item
         * @param {Event} event
         */
            'itemclick',
        /**
         * @event itemdoubleclick
         * Fires when a doubleclick event occurs on a series item.
         * @param {Ext.chart.series.Series} series
         * @param {Object} item
         * @param {Event} event
         */
            'itemdoubleclick',
        /**
         * @event itemtap
         * Fires when a tap event occurs on a series item.
         * @param {Ext.chart.series.Series} series
         * @param {Object} item
         * @param {Event} event
         */
            'itemtap',
        /**
         * @event itemtapstart
         * Fires when a tapstart event occurs on a series item.
         * @param {Ext.chart.series.Series} series
         * @param {Object} item
         * @param {Event} event
         */
            'itemtapstart',
        /**
         * @event itemtapend
         * Fires when a tapend event occurs on a series item.
         * @param {Ext.chart.series.Series} series
         * @param {Object} item
         * @param {Event} event
         */
            'itemtapend',
        /**
         * @event itemtapcancel
         * Fires when a tapcancel event occurs on a series item.
         * @param {Ext.chart.series.Series} series
         * @param {Object} item
         * @param {Event} event
         */
            'itemtapcancel',
        /**
         * @event itemtaphold
         * Fires when a taphold event occurs on a series item.
         * @param {Ext.chart.series.Series} series
         * @param {Object} item
         * @param {Event} event
         */
            'itemtaphold',
        /**
         * @event itemdoubletap
         * Fires when a doubletap event occurs on a series item.
         * @param {Ext.chart.series.Series} series
         * @param {Object} item
         * @param {Event} event
         */
            'itemdoubletap',
        /**
         * @event itemsingletap
         * Fires when a singletap event occurs on a series item.
         * @param {Ext.chart.series.Series} series
         * @param {Object} item
         * @param {Event} event
         */
            'itemsingletap',
        /**
         * @event itemtouchstart
         * Fires when a touchstart event occurs on a series item.
         * @param {Ext.chart.series.Series} series
         * @param {Object} item
         * @param {Event} event
         */
            'itemtouchstart',
        /**
         * @event itemtouchmove
         * Fires when a touchmove event occurs on a series item.
         * @param {Ext.chart.series.Series} series
         * @param {Object} item
         * @param {Event} event
         */
            'itemtouchmove',
        /**
         * @event itemtouchend
         * Fires when a touchend event occurs on a series item.
         * @param {Ext.chart.series.Series} series
         * @param {Object} item
         * @param {Event} event
         */
            'itemtouchend',
        /**
         * @event itemdragstart
         * Fires when a dragstart event occurs on a series item.
         * @param {Ext.chart.series.Series} series
         * @param {Object} item
         * @param {Event} event
         */
            'itemdragstart',
        /**
         * @event itemdrag
         * Fires when a drag event occurs on a series item.
         * @param {Ext.chart.series.Series} series
         * @param {Object} item
         * @param {Event} event
         */
            'itemdrag',
        /**
         * @event itemdragend
         * Fires when a dragend event occurs on a series item.
         * @param {Ext.chart.series.Series} series
         * @param {Object} item
         * @param {Event} event
         */
            'itemdragend',
        /**
         * @event itempinchstart
         * Fires when a pinchstart event occurs on a series item.
         * @param {Ext.chart.series.Series} series
         * @param {Object} item
         * @param {Event} event
         */
            'itempinchstart',
        /**
         * @event itempinch
         * Fires when a pinch event occurs on a series item.
         * @param {Ext.chart.series.Series} series
         * @param {Object} item
         * @param {Event} event
         */
            'itempinch',
        /**
         * @event itempinchend
         * Fires when a pinchend event occurs on a series item.
         * @param {Ext.chart.series.Series} series
         * @param {Object} item
         * @param {Event} event
         */
            'itempinchend',
        /**
         * @event itemswipe
         * Fires when a swipe event occurs on a series item.
         * @param {Ext.chart.series.Series} series
         * @param {Object} item
         * @param {Event} event
         */
            'itemswipe'

            // TODO itemtouchenter, itemtouchleave?
        ]
    },


    constructor: function () {
        var me = this,
            itemEventNames = me.statics().itemEventNames;
        me.enableBubble(itemEventNames);
    },

    initialize: function () {
        var me = this;
        me.getChart().on({
            scope: me,
            mousemove: me.onMouseMove,
            mouseup: me.onMouseUp,
            mousedown: me.onMouseDown,
            click: me.onClick,
            doubleclick: me.onDoubleClick,
            tap: me.onTap,
            tapstart: me.onTapStart,
            tapend: me.onTapEnd,
            tapcancel: me.onTapCancel,
            longpress: me.onLongPress,
            doubletap: me.onDoubleTap,
            singletap: me.onSingleTap,
            touchstart: me.onTouchStart,
            touchmove: me.onTouchMove,
            touchend: me.onTouchEnd,
            dragstart: me.onDragStart,
            drag: me.onDrag,
            dragend: me.onDragEnd,
            pinchstart: me.onPinchStart,
            pinch: me.onPinch,
            pinchend: me.onPinchEnd,
            swipe: me.onSwipe
        });
    },

    itemForEvent: function (e) {
        var me = this;
        if (me.lastEvent != e) {
            me.lastEvent = e;
            var me = this,
                chartXY = me.getChart().getEventXY(e);
            return me.lastItemForEvent = me.getItemForPoint(chartXY[0], chartXY[1]);
        }
        return me.lastItemForEvent;
    },

    getBubbleTarget: function () {
        return this.getChart();
    },

    onMouseMove: function (e) {
        var me = this,
            lastItem = me.lastOverItem,
            item = me.itemForEvent(e);
        if (lastItem && item !== lastItem) {
            me.fireEvent('itemmouseout', me, lastItem, e);
            delete me.lastOverItem;
        }
        if (item) {
            me.fireEvent('itemmousemove', me, item, e);
        }
        if (item && item !== lastItem) {
            me.fireEvent('itemmouseover', me, item, e);
            me.lastOverItem = item;
        }
    }
}, function () {
    function createEventRelayMethod(name) {
        return function (e) {
            var me = this,
                item = me.itemForEvent(e);
            if (item) {
                me.fireEvent(name, me, item, e);
            }
        }
    }

    Ext.apply(this.prototype, {
        // Events directly relayed when on an item:
        onMouseUp: createEventRelayMethod('itemmouseup'),
        onMouseDown: createEventRelayMethod('itemmousedown'),
        onClick: createEventRelayMethod('itemclick'),
        onDoubleClick: createEventRelayMethod('itemdoubleclick'),
        onTap: createEventRelayMethod('itemtap'),
        onTapStart: createEventRelayMethod('itemtapstart'),
        onTapEnd: createEventRelayMethod('itemtapend'),
        onTapCancel: createEventRelayMethod('itemtapcancel'),
        onLongPress: function (e) {
            var me = this,
                item = me.itemForEvent(e);
            if (item) {
                me.fireEvent('itemlongpress', me, item, e);
                //<deprecated product=charts since=2.0>
                me.fireEvent('itemtaphold', me, item, e);
                //</deprecated>
            }
        },
        onDoubleTap: createEventRelayMethod('itemdoubletap'),
        onSingleTap: createEventRelayMethod('itemsingletap'),
        onTouchStart: createEventRelayMethod('itemtouchstart'),
        onTouchMove: createEventRelayMethod('itemtouchmove'),
        onTouchEnd: createEventRelayMethod('itemtouchend'),
        onDragStart: createEventRelayMethod('itemdragstart'),
        onDrag: createEventRelayMethod('itemdrag'),
        onDragEnd: createEventRelayMethod('itemdragend'),
        onPinchStart: createEventRelayMethod('itempinchstart'),
        onPinch: createEventRelayMethod('itempinch'),
        onPinchEnd: createEventRelayMethod('itempinchend'),
        onSwipe: createEventRelayMethod('itemswipe')
    });
});


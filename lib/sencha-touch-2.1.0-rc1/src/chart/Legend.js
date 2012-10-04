/**
 * A default legend for charts.
 */
Ext.define("Ext.chart.Legend", {
    xtype: 'legend',
    extend: "Ext.dataview.DataView",
    config: {
        itemTpl: [
            "<span class=\"x-legend-item-marker {[values.disabled?\'x-legend-inactive\':\'\']}\" style=\"background:{mark};\"></span>{name}"
        ],
        baseCls: 'x-legend',
        padding: 5,
        disableSelection: true,
        inline: true,
        /**
         * @cfg {String} position
         * @deprecated Use `docked` instead.
         * Delegates to `docked`
         */
        position: 'top',
        horizontalHeight: 48,
        verticalWidth: 150
    },

    constructor: function () {
        this.callSuper(arguments);

        var scroller = this.getScrollable().getScroller(),
            onDrag = scroller.onDrag;
        scroller.onDrag = function (e) {
            e.stopPropagation();
            onDrag.call(this, e);
        };
    },

    doSetDocked: function (docked) {
        this.callSuper(arguments);
        if (docked === 'top' || docked === 'bottom') {
            this.setLayout({type: 'hbox', pack: 'center'});
            this.setInline(true);
            // TODO: Remove this when possible
            this.setWidth(null);
            this.setHeight(this.getHorizontalHeight());
            this.setScrollable({direction: 'horizontal' });
        } else {
            this.setLayout({pack: 'center'});
            this.setInline(false);
            // TODO: Remove this when possible
            this.setWidth(this.getVerticalWidth());
            this.setHeight(null);
            this.setScrollable({direction: 'vertical' });
        }
    },

    updatePosition: function (position) {
        this.setDocked(position);
    },

    onItemTap: function (container, target, index, e) {
        this.callSuper(arguments);
        var me = this,
            store = me.getStore(),
            record = store && store.getAt(index);
        record.beginEdit();
        record.set('disabled', !record.get('disabled'));
        record.commit();
    }
});
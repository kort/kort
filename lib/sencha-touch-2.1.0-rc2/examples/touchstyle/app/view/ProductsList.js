Ext.define('TouchStyle.view.ProductsList', {
    extend: 'Ext.carousel.Infinite',
    xtype: 'productslist',
    requires: ['TouchStyle.view.Products'],

    config: {
        direction: 'horizontal',

        innerItemConfig: {
            xclass: 'TouchStyle.view.Products'
        },

        count: 'auto',

        offsetLimit: 50,

        store: null,

        animation: {
            duration: 650
        },

        listeners: {
            activeitemchange: 'onActiveItemChange',
            itemindexchange: 'onItemIndexChange'
        }
    },

    initialize: function() {
        Ext.Viewport.on('orientationchange', this.onOrientationChange, this);

        this.element.on({
            scope: this,
            tap: 'onTap'
        });
    },

    onTap: function(e) {
        var element = Ext.get(e.target),
            store = this.getStore(),
            id;

        if (!element.hasCls('product')) {
            element = Ext.get(e.target).parent('.product');
        }

        id = Math.abs(element.getAttribute('ref'));
        record = store.getAt(store.findExact('id', id));
        if (record) {
            this.fireEvent('itemtap', this, record);
        }
    },

    applyCount: function(count) {
        if (count == "auto") {
            count = 8;
            if (Ext.Viewport.getOrientation() == "landscape") {
                count = 7;
            }
        }

        return count;
    },

    onOrientationChange: function(vewport, orientation) {
        var oldCount = this.getCount(),
            newCount = this.applyCount(this.config.count);

        if (oldCount != newCount) {
            this.setCount(newCount);
            this.refreshItems();
        }
    },

    updateStore: function(newStore) {
        var me = this;

        if (newStore.isLoading()) {
            me.setMasked({
                xtype: 'loadmask'
            });

            newStore.on('load', function() {
                me.setMasked(false);

                me.updateStore(newStore);
            }, me, {
                single: true
            });
        } else {
            me.reset();
        }
    },

    onActiveItemChange: function(carousel, newItem, oldItem) {
        var index = carousel.getActiveIndex(),
            count = this.getCount(),
            offsetLimit = this.getOffsetLimit(),
            store = this.getStore(),
            storeCount = store.getCount();

        if (storeCount - (count * index) < offsetLimit && !store.isLoading()) {
            store.nextPage();
        }
    },

    onItemIndexChange: function(me, item, index) {
        var store = this.getStore(),
            count = this.getCount(),
            records, startIndex, endIndex,
            i;

        if (!store) {
            return;
        }

        startIndex = index * count;

        if (count > 1) {
            endIndex = startIndex + count;
        } else {
            endIndex = startIndex;
        }

        records = store.queryBy(function(record, id) {
            i = store.indexOf(record);
            if (i >= startIndex && i <= endIndex) {
                return record;
            }
        }, this);

        item.setRecords(records);
    }
});

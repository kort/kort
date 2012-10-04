Ext.define('TouchStyle.view.Categories', {
    extend: 'Ext.dataview.DataView',
    xtype: 'categories',

    config: {
        baseCls: 'categories-list',

        itemTpl: [
            '<div class="image" style="background-image:url(http://resources.shopstyle.com/static/mobile/image2-iPad/{urlId}.png)"></div>',
            '<div class="name">{label}</div>'
        ].join(''),

        records: null
    },

    applyData: function(data) {
        this.setRecords(data);
        return Ext.pluck(data || [], 'data');
    },

    onItemTap: function(container, target, index, e) {
        var me = this,
            store = me.getStore(),
            records = me.getRecords(),
            record = store && records[index];

        me.fireEvent('itemtap', me, index, target, record, e);
    }
});

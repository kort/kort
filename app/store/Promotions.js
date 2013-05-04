/**
 * Store for promotions
 */

//define own reader to convert unix timestamp to string representation of date property
Ext.define('My.PromotionReader', {
    extend: 'Ext.data.reader.Json',
    alias: 'reader.promotions',
    getData: function(data) {       // overriding
        data = this.callParent(arguments);
        var result = [];
        Ext.each(data.return, function(entry) {
            entry.startdate=Ext.Date.format(new Date(entry.startdate*1000), 'd.m.Y');
            entry.enddate=Ext.Date.format(new Date(entry.enddate*1000), 'd.m.Y');
                result.push({
                    id: entry.id, startdate: entry.startdate, enddate:entry.enddate, extra_coins:entry.extra_coins,title:entry.title
                });
        });
        return data.return;
    }
});

Ext.define('Kort.store.Promotions', {
    extend: 'Ext.data.Store',

    config: {
        model: 'Kort.model.Promotion',
        proxy: {
            type: 'ajax',
            url: './resources/stores/promotions.json',
            reader:'promotions'
        },
        autoLoad:false
    }
});
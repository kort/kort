/*
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
*/

/**
 * Store for promotions.
 */
Ext.define('Kort.store.Promotions', {
    extend: 'Ext.data.Store',

    config: {
        model: 'Kort.model.Promotion',
        proxy: {
            type: 'rest',
            url: Kort.util.Config.getWebservices().promotion.url,
            startParam: false,
            extraParams: {
                'lang': Kort.util.Config.getLanguage()
            },
            reader: {
                type: 'json',
                rootProperty: 'return'
            }
        }
        /*
        proxy: {
            type: 'ajax',
            url: './resources/stores/promotions.json',
            reader:'promotions'
        },
        */

    }
});

/**
 * Store for promotions.
 */
Ext.define('Kort.store.Promotions', {
    extend: 'Ext.data.Store',

    config: {
        model: 'Kort.model.Promotion',
        proxy: {
            type: 'rest',
            url: Kort.util.Config.getWebservices().promotion.getUrl(),
            startParam: false,
            extraParams: {
                'lang': Kort.util.Config.getLanguage()
            },
            reader: {
                type: 'json',
                rootProperty: 'return'
            }
        }
    }
});

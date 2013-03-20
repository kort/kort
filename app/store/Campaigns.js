/**
 * Store for campaigns
 */
Ext.define('Kort.store.Campaigns', {
    extend: 'Ext.data.Store',

    config: {
        model: 'Kort.model.Campaign',

        proxy: {
            type: 'rest',
            url: './resources/stores/campaigns.json',
            pageParam: false,
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

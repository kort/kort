Ext.define('GeoCon.store.Committees', {
    extend  : 'Ext.data.Store',

    config: {
        model: 'GeoCon.model.Committee',
        groupField: 'chamber',

        proxy: {
            type: 'jsonp',
            url: 'http://services.sunlightlabs.com/api/committees.allForLegislator',
            callbackKey: 'jsonp',
            extraParams: {
                apikey: '8a341f85c657435989e75c9a83294762'
            },
            reader: {
                type: 'json',
                rootProperty: 'response.committees',
                record: 'committee'
            }
        }
    }
});

Ext.define('GeoCon.store.Legislators', {
    extend  : 'Ext.data.Store',

    config: {
        model: 'GeoCon.model.Legislator',
        groupField: 'fullTitle',

        proxy: {
            type: 'jsonp',
            url: 'http://services.sunlightlabs.com/api/legislators.getList.json',
            callbackKey: 'jsonp',

            // The following must be set to disable extra parameters being sent to the API, which breaks it
            noCache: false,
            startParam: '',
            pageParam: '',
            limitParam: '',

            extraParams: {
                apikey: '8a341f85c657435989e75c9a83294762'
            },
            reader: {
                type: 'json',
                rootProperty: 'response.legislators',
                record: 'legislator'
            }
        }
    }
});

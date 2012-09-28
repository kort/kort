Ext.define('GeoCon.store.Bills', {
    extend  : 'Ext.data.Store',

    config: {
        model: 'GeoCon.model.Bill',
        groupField: 'state',

        proxy: {
            type: 'jsonp',
            url: 'http://api.realtimecongress.org/api/v1/bills.json',

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
                rootProperty: 'bills'
            }
        }
    }
});

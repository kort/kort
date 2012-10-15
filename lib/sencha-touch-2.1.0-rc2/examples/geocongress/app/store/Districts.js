Ext.define('GeoCon.store.Districts', {
    extend  : 'Ext.data.Store',

    config: {
        fields: [ 'state', 'number' ],

        proxy: {
            type: 'jsonp',
            url: 'http://services.sunlightlabs.com/api/districts.getDistrictFromLatLong',
            callbackKey: 'jsonp',
            extraParams: {
                apikey: '8a341f85c657435989e75c9a83294762'
            },
            reader: {
                type: 'json',
                rootProperty: 'response.districts',
                record: 'district'
            }
        }
    }
});

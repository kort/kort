/**
 * Store for missions
 */
Ext.define('Kort.store.Missions', {
    extend: 'Ext.data.Store',
	config: {
        autoLoad: false,
		model: 'Kort.model.Mission',
		proxy: {
			type: 'rest',
            url: './resources/stores/missions.json',
            pageParam: false,
            startParam: false,
            extraParams: {
                'lang': Kort.util.Config.getLanguage(),
                'limit': Kort.util.Config.getWebservices().bug.limit,
                'radius': Kort.util.Config.getWebservices().bug.radius
            },
            reader: {
                type: 'json',
                rootProperty: 'return'
            }
		}
	},

    doOperationalRangeCheck: function(geo,distance) {
        console.log('doOperationalRangeCheck');
        if(!this.isLoading()) {
            this.each(function(record, index, length) {
                record.set('inOperationalRange', (geo.getDistance(record.get('latitude'), record.get('longitude')) < distance) ? true : false);
            });
        }
    }

});

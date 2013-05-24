/**
 * Store for validations
 */
Ext.define('Kort.store.Validations', {
    extend: 'Ext.data.Store',

	config: {
		model: 'Kort.model.Validation',
		proxy: {
			type: 'rest',
            url: './resources/stores/validations.json',
            pageParam: false,
            startParam: false,
            extraParams: {
                'lang': Kort.util.Config.getLanguage(),
                'limit': Kort.util.Config.getWebservices().validation.limit,
                'radius': Kort.util.Config.getWebservices().validation.radius
            },
            reader: {
                type: 'json',
                rootProperty: 'return'
            }
		},
        autoLoad:false
	},

    /**
     * For each validation in store, calculate if it is in the operational range and therefore solvable.
     * @param {Kort.util.Geolocation} geo The geolocation object which holds the current user position.
     * @param {number} distance The radius of the operational range.
     */
    doOperationalRangeCheck: function(geo,distance) {
        if(!this.isLoading()) {
            this.each(function(record, index, length) {
                record.set('inOperationalRange', (geo.getDistance(record.get('latitude'), record.get('longitude')) < distance) ? true : false);
            });
        }
    }
});

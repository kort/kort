/**
 * Store for validations
 */
Ext.define('Kort.store.Validations', {
    extend: 'Ext.data.Store',

	config: {
		model: 'Kort.model.Validation',

		grouper: {
            groupFn: function(record) {
                var validationsLeft = record.get('required_votes') - record.get('upratings') + record.get('downratings');
                return validationsLeft + ' <span class="text">' + Ext.i18n.Bundle.message('validation.list.header') + '</span>';
            }
        },
        sorters: [
            {
                // Sort by distance
                sorterFn: function(record1, record2) {
                    var distance1 = record1.get('distance'),
                        distance2 = record2.get('distance');
                    return distance1 > distance2 ? 1 : (distance1 === distance2 ? 0 : -1);
                },
                direction: 'ASC'
            }
        ],

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
		}
	},

    /**
     * Update distances of trails in store
     * @param {Kort.util.Geolocation} geo Geolocation to calculate distance
     */
	updateDistances: function(geo) {
        console.log('updatedistances');
		if(!this.isLoading()) {
			this.each(function(record, index, length) {
				record.set('distance', geo.getDistance(record.get('latitude'), record.get('longitude')));
				record.set('formatted_distance', geo.getFormattedDistance(record.get('distance')));
			});
			this.sort();
		}
	}
});

Ext.define('Kort.store.Validations', {
    extend: 'Ext.data.Store',
	
	config: {
		model: 'Kort.model.Validation',
        
		grouper: {
            groupFn: function(record) {
                var validationsLeft = record.get('requiredValidations') - record.get('upratings') + record.get('downratings');
                return validationsLeft + ' ' + Ext.i18n.Bundle.message('validation.list.header');
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
			type: 'ajax',
            url : './resources/stores/validations.json',
            reader: {
                type: 'json'
            }
		}
	},
    
    /**
     * Update distances of trails in store
     */
	updateDistances: function(geo) {
		if(!this.isLoading()) {
			this.each(function(record, index, length) {
				record.set('distance', geo.getDistance(record.get('latitude'), record.get('longitude')));
				record.set('formattedDistance', geo.getFormattedDistance(record.get('distance')));
			});
			this.sort();
		}
	}
});

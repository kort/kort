Ext.define('Kort.store.Validations', {
    extend: 'Ext.data.Store',
	
	config: {
		model: 'Kort.model.Validation',
        autoLoad: true,
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
			type: "ajax",
            url : "./resources/stores/validations.json",
            reader: {
                type: "json"
            }
		}
	}
});

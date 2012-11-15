Ext.define('Kort.model.Validation', {
    extend: 'Ext.data.Model',
    config: {
		idProperty: 'id',
		
        fields: [
			{ name: 'id', type: 'auto' },
			{ name: 'osm_id', type: 'int' },
			{ name: 'osm_type', type: 'string' },
			{ name: 'title', type: 'string' },
			{ name: 'description', type: 'string' },
			{ name: 'fixmessage', type: 'string' },
            { name: 'upratings', type: 'int' },
            { name: 'downratings', type: 'int' },
            { name: 'requiredValidations', type: 'int' },
            { name: 'latitude', type: 'string' },
            { name: 'longitude', type: 'string' },
            { name: 'distance', type: 'int' },
            { name: 'formattedDistance', type: 'string' }
        ]
    }
});
Ext.define('Kort.model.Bug', {
    extend: 'Ext.data.Model',
    config: {
		idProperty: 'id',
		
        fields: [
			{ name: 'id', type: 'auto' },
			{ name: 'title', type: 'string' },
			{ name: 'description', type: 'string' },
            { name: 'lat', type: 'string' },
            { name: 'lon', type: 'string' },
			{ name: 'type', type: 'string' }
        ]
    }
});
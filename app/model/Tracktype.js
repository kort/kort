Ext.define('Kort.model.Tracktype', {
    extend: 'Ext.data.Model',
    config: {
		idProperty: 'id',
		
        fields: [
			{ name: 'id', type: 'auto' },
			{ name: 'type_key', type: 'string' },
			{ name: 'title', type: 'string' },
			{ name: 'sorting', type: 'integer' }
        ]
    }
});
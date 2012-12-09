/**
 * Model for a select answer
 */
Ext.define('Kort.model.SelectAnswer', {
    extend: 'Ext.data.Model',
    config: {
		idProperty: 'id',
		
        fields: [
			{ name: 'id', type: 'auto' },
			{ name: 'value', type: 'string' },
			{ name: 'title', type: 'string' },
			{ name: 'type', type: 'string' },
			{ name: 'sorting', type: 'int' }
        ]
    }
});
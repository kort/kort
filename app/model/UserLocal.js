Ext.define('Kort.model.UserLocal', {
    extend: 'Ext.data.Model',
    config: {
		idProperty: 'secret',

        fields: [
			{ name: 'secret', type: 'auto' }
        ]
    }
});
Ext.define('Kort.model.UserLocal', {
    extend: 'Ext.data.Model',
    config: {
        identifier: 'uuid',

        fields: [
			{ name: 'secret', type: 'string' }
        ]
    }
});
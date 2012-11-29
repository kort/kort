Ext.define('Kort.model.User', {
    extend: 'Ext.data.Model',
    config: {
		idProperty: 'id',

        fields: [
			{ name: 'id', type: 'auto' },
			{ name: 'name', type: 'string' },
			{ name: 'username', type: 'string' },
			{ name: 'email', type: 'string' },
            { name: 'pic_url', type: 'string' },
			{ name: 'logged_in', type: 'boolean' },
			{ name: 'token', type: 'string' },
			{ name: 'fix_count', type: 'int' },
			{ name: 'validation_count', type: 'int' },
			{ name: 'koin_count', type: 'int' },
            { name: 'secret', type: 'string' }
        ]
    }
});
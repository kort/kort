Ext.define('Kort.model.User', {
    extend: 'Ext.data.Model',
    config: {
		idProperty: 'id',

        fields: [
			{ name: 'id', type: 'auto' },
			{ name: 'name', type: 'string' },
			{ name: 'username', type: 'string' },
			{ name: 'email', type: 'string' },
            { name: 'picUrl', type: 'string' },
			{ name: 'loggedIn', type: 'boolean' },
			{ name: 'token', type: 'string' },
			{ name: 'fixCount', type: 'int' },
			{ name: 'validationCount', type: 'int' },
			{ name: 'koinCount', type: 'int' }
        ]
    }
});
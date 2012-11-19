Ext.define('Kort.model.HighscoreEntry', {
    extend: 'Ext.data.Model',
    config: {
		idProperty: 'user_id',

        fields: [
			{ name: 'user_id', type: 'auto' },
			{ name: 'username', type: 'string' },
			{ name: 'koinCount', type: 'int' },
            { name: 'ranking', type: 'int' }
        ]
    }
});
Ext.define('Kort.model.HighscoreEntry', {
    extend: 'Ext.data.Model',
    config: {
		idProperty: 'user_id',

        fields: [
			{ name: 'user_id', type: 'auto' },
			{ name: 'username', type: 'string' },
            { name: 'fix_count', type: 'int' },
            { name: 'vote_count', type: 'int' },
			{ name: 'koin_count', type: 'int' },
            { name: 'ranking', type: 'int' }
        ]
    }
});
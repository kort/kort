/**
 * Model for a reward
 */
Ext.define('Kort.model.Reward', {
    extend: 'Ext.data.Model',
    config: {
		idProperty: 'id',
		
        fields: [
			{ name: 'id', type: 'auto' },
			{ name: 'koin_count_new', type: 'string' },
			{ name: 'koin_count_total', type: 'string' },
            { name: 'badges', type: 'array' }
        ],
        
        hasMany: { model: 'Badge', name: 'badges' }
    }
});
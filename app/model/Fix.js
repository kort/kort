/**
 * Model for a fix
 */
Ext.define('Kort.model.Fix', {
    extend: 'Ext.data.Model',
    config: {
		idProperty: 'id',
		
        fields: [
			{ name: 'id', type: 'auto' },
			{ name: 'user_id', type: 'int' },
			{ name: 'error_id', type: 'string' },
			{ name: 'message', type: 'string' }
        ],
        
		proxy: {
			type: 'rest',
            url: './server/webservices/bug/fix'
		}
    }
});
Ext.define('Kort.model.Fix', {
    extend: 'Ext.data.Model',
    config: {
		idProperty: 'id',
		
        fields: [
			{ name: 'id', type: 'auto' },
			{ name: 'error_id', type: 'string' },
			{ name: 'message', type: 'string' }
        ],
        
		proxy: {
			type: 'rest',
            url : './server/webservices/bug/fix',
            reader: {
                type: 'json'
            }
		}
    }
});
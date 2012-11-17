Ext.define('Kort.model.Vote', {
    extend: 'Ext.data.Model',
    config: {
		idProperty: 'id',
		
        fields: [
			{ name: 'id', type: 'auto' },
			{ name: 'validation_id', type: 'string' },
			{ name: 'message', type: 'string' }
        ],
        
		proxy: {
			type: "rest",
            url : "./server/webservices/validation/vote",
            reader: {
                type: "json"
            }
		}
    }
});
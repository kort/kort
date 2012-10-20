Ext.define('Kort.model.Fix', {
    extend: 'Ext.data.Model',
    config: {
		idProperty: 'id',
		
        fields: [
			{ name: 'id', type: 'auto' },
			{ name: 'bugid', type: 'string' },
			{ name: 'fix', type: 'string' }
        ],
        
		proxy: {
			type: "rest",
            url : "./server/webservices/bug/fixes",
            reader: {
                type: "json"
            }
		}
    }
});
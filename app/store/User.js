Ext.define('Kort.store.User', {
    extend: 'Ext.data.Store',

	config: {
		model: 'Kort.model.User',

		proxy: {
			type: 'rest',
            url : './server/webservices/user',
            reader: {
                type: 'json'
            }
        }
	}
});

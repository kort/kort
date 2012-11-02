Ext.define('Kort.store.User', {
    extend: 'Ext.data.Store',

	config: {
		model: 'Kort.model.User',

		proxy: {
			type: "ajax",
            url : "./server/webservices/user",
            reader: {
                type: "json"
            }
		}
	}
});

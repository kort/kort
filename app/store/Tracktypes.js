Ext.define('Kort.store.Tracktypes', {
    extend: 'Ext.data.Store',
	
	config: {
		model: 'Kort.model.Tracktype',
		
		proxy: {
			type: "ajax",
            url : "./server/webservices/bug/tracktypes",
            sorters: 'sorting',
            reader: {
                type: "json"
            }
		}
	}
});

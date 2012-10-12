Ext.define('Kort.store.Bugs', {
    extend: 'Ext.data.Store',
	
	config: {
		model: 'Kort.model.Bug',
		
		proxy: {
			type: "ajax",
            url : "./app/bugs.json",
            reader: {
                type: "json",
                rootProperty: "bugs"
            }
		}
	}
});
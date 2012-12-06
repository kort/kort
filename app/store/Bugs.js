Ext.define('Kort.store.Bugs', {
    extend: 'Ext.data.Store',
	
	config: {
		model: 'Kort.model.Bug',
		
		proxy: {
			type: 'rest',
            url: './resources/stores/bugs.json',
            extraParams: {
                'radius': Kort.util.Config.getBugs().radius
            },
            reader: {
                type: 'json',
                rootProperty: 'return'
            }
		}
	}
});

/**
 * Store for bugs
 */
Ext.define('Kort.store.Bugs', {
    extend: 'Ext.data.Store',
	
	config: {
		model: 'Kort.model.Bug',
		
		proxy: {
			type: 'rest',
            url: './resources/stores/bugs.json',
            pageParam: false,
            startParam: false,
            extraParams: {
                'limit': Kort.util.Config.getWebservices().bug.limit,
                'radius': Kort.util.Config.getWebservices().bug.radius
            },
            reader: {
                type: 'json',
                rootProperty: 'return'
            }
		}
	}
});

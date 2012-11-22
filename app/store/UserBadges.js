Ext.define('Kort.store.UserBadges', {
    extend: 'Ext.data.Store',

	config: {
		model: 'Kort.model.Badge',
        autoSync: true,
        
		proxy: {
			type: "rest",
            url : "",
            reader: {
                type: "json"
            }
		}
	}
});

Ext.define('Kort.store.UserBadges', {
    extend: 'Ext.data.Store',

	config: {
		model: 'Kort.model.Badge',
        
		proxy: {
			type: 'rest',
            url : '',
            sorters: 'sorting',
            reader: {
                type: 'json'
            }
		}
	}
});

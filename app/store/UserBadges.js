/**
 * Store for user badges
 */
Ext.define('Kort.store.UserBadges', {
    extend: 'Ext.data.Store',

	config: {
		model: 'Kort.model.Badge',
        
		proxy: {
			type: 'rest',
            url: '',
            pageParam: false,
            startParam: false,
            limitParam: false,
            sorters: 'sorting',
            reader: {
                type: 'json',
                rootProperty: 'return'
            }
		}
	}
});

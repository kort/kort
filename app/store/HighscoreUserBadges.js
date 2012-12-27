/**
 * Store for highscore user badges
 */
Ext.define('Kort.store.HighscoreUserBadges', {
    extend: 'Ext.data.Store',

	config: {
		model: 'Kort.model.HighscoreUserBadge',
        
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

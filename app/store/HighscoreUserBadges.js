/**
 * Store for highscore user badges
 */
Ext.define('Kort.store.HighscoreUserBadges', {
    extend: 'Ext.data.Store',

	config: {
		model: 'Kort.model.HighscoreUserBadge',
        sorters: {
            property : 'sorting',
            direction: 'asc'
        },

		proxy: {
			type: 'rest',
            url: '',
            pageParam: false,
            startParam: false,
            limitParam: false,
            extraParams: {
                'lang': Kort.util.Config.getLanguage()
            },
            reader: {
                type: 'json',
                rootProperty: 'return'
            }
		}
	}
});

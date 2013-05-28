/**
 * Store for relative highscore entries.
 */
Ext.define('Kort.store.HighscoreRelative', {
    extend: 'Ext.data.Store',

	config: {
		model: 'Kort.model.HighscoreEntry',
        clearOnPageLoad: false,
        sorters: {
            property : 'ranking',
            direction: 'asc'
        },

		proxy: {
			type: 'rest',
            url: Kort.util.Config.getWebservices().highscore.relativeUrl,
            startParam: false,
            extraParams: {
                'lang': Kort.util.Config.getLanguage(),
                'limit': Kort.util.Config.getWebservices().highscore.limit
            },
            reader: {
                type: 'json',
                rootProperty: 'return'
            }
		},
        pageSize:10
	}
});

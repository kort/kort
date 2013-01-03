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
            extraParams: {
                'lang': Ext.i18n.Bundle.guessLanguage()
            },
            sorters: 'sorting',
            reader: {
                type: 'json',
                rootProperty: 'return'
            }
		}
	}
});

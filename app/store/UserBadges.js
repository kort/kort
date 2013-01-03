/**
 * Store for user badges
 */
Ext.define('Kort.store.UserBadges', {
    extend: 'Ext.data.Store',

	config: {
		model: 'Kort.model.UserBadge',

		proxy: {
			type: 'rest',
            url: '',
            pageParam: false,
            startParam: false,
            limitParam: false,
            sorters: 'sorting',
            extraParams: {
                'lang': Ext.i18n.Bundle.guessLanguage()
            },
            reader: {
                type: 'json',
                rootProperty: 'return'
            }
		}
	}
});

/**
 * Store for select answers.
 */
Ext.define('Kort.store.SelectAnswers', {
    extend: 'Ext.data.Store',

	config: {
		model: 'Kort.model.SelectAnswer',
        sorters: {
            property : 'sorting',
            direction: 'asc'
        },

		proxy: {
			type: 'rest',
            url: Kort.util.Config.getWebservices().answer.getUrl(),
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

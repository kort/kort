/**
 * Store for select answers
 */
Ext.define('Kort.store.SelectAnswers', {
    extend: 'Ext.data.Store',

	config: {
		model: 'Kort.model.SelectAnswer',

		proxy: {
			type: 'rest',
            url: './server/webservices/answer',
            sorters: 'sorting',
            reader: {
                type: 'json',
                rootProperty: 'return'
            }
		}
	}
});

Ext.define('Kort.store.SelectAnswers', {
    extend: 'Ext.data.Store',
	
	config: {
		model: 'Kort.model.SelectAnswer',
		
		proxy: {
			type: 'ajax',
            url : './server/webservices/bug/selectanswers',
            sorters: 'sorting',
            reader: {
                type: 'json'
            }
		}
	}
});

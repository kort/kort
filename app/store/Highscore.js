Ext.define('Kort.store.Highscore', {
    extend: 'Ext.data.Store',
	
	config: {
		model: 'Kort.model.HighscoreEntry',
		
		proxy: {
			type: 'rest',
            url : './server/webservices/highscore',
            sorters: 'place',
            reader: {
                type: 'json'
            }
		}
	}
});

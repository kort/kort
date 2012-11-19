Ext.define('Kort.store.Highscore', {
    extend: 'Ext.data.Store',
	
	config: {
		model: 'Kort.model.HighscoreEntry',
		
		proxy: {
			type: 'ajax',
            url : './resources/stores/highscore.json',
            sorters: 'place',
            reader: {
                type: 'json'
            }
		}
	}
});

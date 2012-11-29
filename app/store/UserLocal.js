Ext.define('Kort.store.UserLocal', {
    extend: 'Ext.data.Store',

	config: {
		model: 'Kort.model.UserLocal',
        autoSync: true,

		proxy: {
            type: 'localstorage',
            id: 'kort-user'
        }
	}
});

/**
 * Local store for user settings.
 */
Ext.define('Kort.store.UserLocal', {
    extend: 'Ext.data.Store',
    requires: [
        'Ext.data.proxy.LocalStorage'
    ],

	config: {
		model: 'Kort.model.UserLocal',
        autoSync: true,

		proxy: {
            type: 'localstorage',
            id: 'kort-user'
        }
	}
});

/**
 * Pull refresh plugin for validation list
 */
Ext.define('Kort.view.validation.PullRefreshPlugin', {
    extend: 'Kort.plugin.PullRefresh',
    alias: 'plugin.validationpullrefresh',
	
	config: {
       refreshFn: function(callbackFn, scope) {
            var me = this,
                list = me.getList(),
                store = list.getStore();

            if (store) {
                store.load(function(records, operation, success) {
                    store.updateDistances(Kort.geolocation);
                });
            }
        }
	}
});
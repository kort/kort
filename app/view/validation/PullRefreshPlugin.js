Ext.define('Kort.view.validation.PullRefreshPlugin', {
    extend: 'Kort.plugin.PullRefresh',
    alias: 'plugin.validationpullrefresh',
    
    requires: [
        'Kort.plugin.PullRefresh'
    ],
	
	config: {
       refreshFn: function(callbackFn, scope) {
            var me = this,
                list = me.getList(),
                store = list.getStore();

            if (store) {
                store.load(function(records, operation, success) {
                    store.updateDistances(Kort.geolocation);
                    callbackFn.call(scope);
                    // wait until bounce back animation is done
                    Ext.defer(function() {
                        list.refresh();
                    }, 500);
                });
            } else {
                callbackFn.call(scope);
            }
        }
	}
});
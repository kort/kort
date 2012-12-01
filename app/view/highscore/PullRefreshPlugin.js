Ext.define('Kort.view.highscore.PullRefreshPlugin', {
    extend: 'Kort.plugin.PullRefresh',
    alias: 'plugin.highscorepullrefresh',
    
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
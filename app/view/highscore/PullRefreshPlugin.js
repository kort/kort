Ext.define('Kort.view.highscore.PullRefreshPlugin', {
    extend: 'Kort.plugin.PullRefresh',
    alias: 'plugin.highscorepullrefresh',
    
    requires: [
        'Kort.plugin.PullRefresh'
    ],
	
	config: {
       refreshFn: function() {
            var me = this,
                list = me.getList(),
                store = list.getStore();

            if (store) {
                store.load(function(records, operation, success) {
                    list.refresh();
                });
            }
        }
	}
});
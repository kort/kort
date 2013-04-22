/**
 * Pull refresh plugin for highscore list
 */
Ext.define('Kort.view.highscore.PullRefreshPlugin', {
    extend: 'Kort.plugin.PullRefresh',
    alias: 'plugin.highscorepullrefresh',
	
	config: {
       refreshFn: function() {
            var me = this,
                store = me.getList().getStore();

            if (store) {
                // reset store and load first page
                var index = 6;//store.findExact("user_id",you.id);
                console.log("index ist "+index);
                var clearOnPageLoad = store.getClearOnPageLoad ();
                store.load({},{
                    page: 0,
                   start: index -1,
                    limit: 3,
                    addRecords: !clearOnPageLoad
                });
//                store.loadPage(1, {
//                    addRecords: false
//                });
            }
        }
	}
});
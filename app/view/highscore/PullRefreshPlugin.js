/**
 * Pull refresh plugin for highscore list
 */
Ext.define('Kort.view.highscore.PullRefreshPlugin', {
    extend: 'Kort.plugin.PullRefresh',
    alias: 'plugin.highscorepullrefresh',
	
	config: {
       refreshFn: function() {
            var me = this,
                store = me.getList().getStore(),
                index,
                clearOnPageLoad;

            if (store) {
                // reset store and load first page
                index = 6;//store.findExact("user_id",you.id);
                clearOnPageLoad = store.getClearOnPageLoad();
                console.log("index ist "+index);
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
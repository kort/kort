/**
 * Pull refresh plugin for highscore list.
 */
Ext.define('Kort.view.highscore.PullRefreshPlugin', {
    extend: 'Kort.plugin.PullRefresh',
    alias: 'plugin.highscorepullrefresh',

	
	config: {
       refreshFn: function() {
            var me = this,
                store = me.getList().getStore(),
                rank,
                clearOnPageLoad;

            if (store && store.page > 1) {
                // reset store and load page

                rank = Kort.user.get('ranking');
                clearOnPageLoad = store.getClearOnPageLoad();
                console.log("index ist "+rank + ", page " + (1+Math.floor(rank/10)));

                store.loadPage(store.page -1/* 1 + Math.floor(rank/10)*/ , {
                    addRecords: false
                });
            }
        }
	}
});

//original:
//    config: {
//        refreshFn: function() {
//            var me = this,
//                store = me.getList().getStore();
//
//            if (store) {
//                // reset store and load first page
//                store.loadPage(1, {
//                    addRecords: false
//                });
//            }
//        }
//    }

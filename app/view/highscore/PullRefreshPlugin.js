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
                store.setClearOnPageLoad(true);
                store.loadPage(1);
                store.setClearOnPageLoad(false);
            }
        }
	}
});
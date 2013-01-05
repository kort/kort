/**
 * Pull refresh plugin for highscore list
 */
Ext.define('Kort.view.highscore.PullRefreshPlugin', {
    extend: 'Kort.plugin.PullRefresh',
    alias: 'plugin.highscorepullrefresh',
	
	config: {
       refreshFn: function() {
            var me = this,
                list = me.getList(),
                store = list.getStore();

            if (store) {
                store.load();
            }
        }
	}
});
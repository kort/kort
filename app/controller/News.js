/**
 * Controller for news tab
 */
Ext.define('Kort.controller.News', {
    extend: 'Ext.app.Controller',

    config: {
        views: [
            'news.NavigationView'
        ],
        refs: {
            newsRefreshButton: '#newsNavigationView .button[cls=newsRefreshButton]',
            newsList: '.newslist'
        },
        control: {
            newsRefreshButton: {
                tab: 'refreshNews'
            },
            newsList: {
                itemtap: 'onNewsListItemTap'
            }

        },
        newsLocalStore:null
    },

    init: function() {
        var me = this;
        this.setNewsLocalStore(Ext.getStore('NewsLocal'));
        this.getNewsLocalStore().on('updaterecord',me.newsLocalStoreUpdated,me);
        me.getApplication().on({
            geolocationready: { fn: me.refreshNews, scope: me }
        });
    },

    refreshNews: function() {
        var me = this;
        this.getNewsLocalStore().load({
            callback:me.syncLocalNewsStoreWithRemoteNewsStore,
            scope: me
        });
    },

    syncLocalNewsStoreWithRemoteNewsStore: function() {
        var me = this;
        var newsRemoteStore = Ext.getStore('NewsRemote');
        newsRemoteStore.load({
            callback: function(records, operation, success) {
                records.forEach(function(element) {
                    if(me.getNewsLocalStore().findExact('newsid',element.data.newsid)==-1) {
                        //change model state to force sync to work properly
                        element.set('local',true);
                        me.getNewsLocalStore().add(element);
                    }
                });
                me.getNewsLocalStore().sync();
                me.newsLocalStoreUpdated();
            }
        });
    },

    newsLocalStoreUpdated: function() {
        this.getApplication().fireEvent('newsupdated');
    },

    onNewsListItemTap: function(list, index, target, record, e) {
        record.set('unread',false);
        this.getNewsLocalStore().sync();
        this.getNewsLocalStore().load();

    }

});

/**
 * Controller for news tab
 */
Ext.define('Kort.controller.News', {
    extend: 'Ext.app.Controller',

    config: {
        views: [
            'news.Container'
        ],
        refs: {
            newsContainer: '#newsContainer'
        },
        newsStore:null
    },

    init: function() {
        var me = this;
        console.log('news init');
        this.setNewsStore(Ext.getStore('News'));
        this.getNewsStore().load();
        this.getNewsStore().on('update',me.onStoreLoad(),me);
    },

    onStoreLoad: function() {
        console.log(this.getNewsStore().getAmountOfUnreadNews());
    }
});

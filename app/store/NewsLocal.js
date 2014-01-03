/**
 * Local store for News.
 */
Ext.define('Kort.store.NewsLocal', {
    extend: 'Ext.data.Store',
    requires: [
        'Ext.data.proxy.LocalStorage'
    ],

    config: {
        model: 'Kort.model.News',
        proxy: {
            type:'localstorage',
            id:'newsItems'
        },
        sorters: [
            {
                property: 'updated',
                direction: 'DESC'
            }
        ],
        filters: [
            {
                filterFn: function(item) {
                    return Ext.getStore('UserLocal').getAt(0).get('newsAcceptedLanguageArray').some(function(lang){return lang === item.get('lang');});
                }
            }
        ]
   },

    /**
     * Returns the number of unread news in local storage.
     * @returns {number} count Number of unread News.
     */
    getAmountOfUnreadNews: function(){
    var count=0;
    this.each(function (item, index, length) {
        if(item.get('unread') === true) {
            count++;
        }
    });
    return count;
    }
});

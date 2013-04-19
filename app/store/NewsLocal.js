Ext.define('Kort.store.NewsLocal', {
    extend: 'Ext.data.Store',
    config: {
        model: 'Kort.model.News',
        proxy: {
            type:'localstorage',
            id:'newsItems'
        },
        grouper: {
            groupFn: function(record) {
                return record.get('unread') ? Ext.i18n.Bundle.message('news.unread') : Ext.i18n.Bundle.message('news.read');
            }
        }

   },
    getAmountOfUnreadNews: function(){
    var count=0;
    this.each(function (item, index, length) {
        if(item.get('unread')==true) {
            count++;
        }
    });
    return count;
    }
});

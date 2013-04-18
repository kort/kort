Ext.define('Kort.store.News', {
    extend: 'Ext.data.Store',
    config: {
        model: 'Kort.model.News',
        proxy: {
            type: 'ajax',
            url: './resources/stores/news_default.xml',
            reader: {
                type: 'xml',
                record: 'entry',
                rootProperty: 'feed'
            }
        }
    },
    getAmountOfUnreadNews: function(){
        var count=0;
        this.each(function (item, index, length) {
            console.log(item);
            if(item.get('read')=='false') {
                count++;
            }
        });
        return count;
    }
});
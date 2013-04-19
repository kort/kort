Ext.define('Kort.store.NewsRemote', {
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
        },
        autoload:false
    }
});
Ext.define('Kort.store.NewsRemote', {
    extend: 'Ext.data.Store',
    config: {
        model: 'Kort.model.News',
        proxy: {
            type: 'ajax',
            url: Kort.util.Config.getNewsAtomFeedUrl(),
            reader: {
                type: 'xml',
                record: 'entry',
                rootProperty: 'feed'
            }
        },
        autoload:false
    }
});
/**
 * Store for news. Parse records from news atom feed.
 */
Ext.define('Kort.store.NewsRemote', {
    extend: 'Ext.data.Store',
    requires: [
        'Ext.data.reader.Xml'
    ],
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
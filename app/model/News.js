/**
 * Model for news
 */
Ext.define('Kort.model.News', {
    extend: 'Ext.data.Model',
    config: {
        idProperty: 'newsid',

        fields: [
            { name: 'newsid', mapping:'id', type: 'auto' },
            { name: 'lang', mapping:'title@xml:lang', type: 'string'},
            { name: 'title', mapping:'title', type: 'string' },
            { name: 'content', mapping:'content', type: 'string' },
            { name: 'updated', mapping:'updated', type: 'date'},
            { name: 'link', mapping:'link@href', type: 'string' },
            { name: 'unread', type: 'boolean', defaultValue: true},
            { name: 'local', type: 'boolean', defaultValue: false}
        ]
    }
});

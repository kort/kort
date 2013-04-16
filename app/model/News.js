/**
 * Model for news
 */
Ext.define('Kort.model.News', {
    extend: 'Ext.data.Model',
    config: {
        idProperty: 'newsid',

        fields: [
            { name: 'newsid', type: 'auto' },
            { name: 'feedtitle', type: 'string'},
            { name: 'feedid', type: 'auto'},
            { name: 'lang', type: 'string'},
            { name: 'title', type: 'string' },
            { name: 'content', type: 'string' },
            { name: 'updated', type: 'date'},
            { name: 'link', type: 'string' },
            { name: 'read', type: 'boolean'}
        ]
    }
});

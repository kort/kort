/**
 * Model for news
 */
Ext.define('Kort.model.News', {
    extend: 'Ext.data.Model',
    config: {
        idProperty: 'newsid',

        fields: [
            { name: 'feedid', type: 'auto'},
            { name: 'feedtitle', mapping:'feedTitleProperty>title', type: 'string'},
            { name: 'newsid', mapping:'id', type: 'auto' },
            { name: 'lang', mapping:'content@xml:lang', type: 'string'},
            { name: 'title', mapping:'title', type: 'string' },
            { name: 'content', mapping:'content', type: 'string' },
            { name: 'updated', mapping:'updated', type: 'date'},
            { name: 'link', mapping:'link@href', type: 'string' },
            { name: 'read', type: 'boolean', defaultValue: false}
        ]
    },
    init: function() {
        console.log(this);
    }

});

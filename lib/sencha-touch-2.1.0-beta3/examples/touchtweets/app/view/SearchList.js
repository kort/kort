/**
 * @class Twitter.view.SearchList
 * @extends Ext.dataview.List
 *
 * This shows all of the Searches that the user has saved. It's {@link #defaultType} is searchlistitem.
 *
 * The configured store loads the Search model instances using Search's default proxy (see app/models/Search.js).
 */
Ext.define('Twitter.view.SearchList', {
    extend: 'Ext.DataView',
    xtype : 'searchlist',
    requires: ['Twitter.view.SearchListItem'],

    config: {
        ui           : 'searchlist',
        baseCls      : 'x-list',
        store        : 'Searches',
        defaultType  : 'searchlistitem',
        scrollable   : 'vertical',
        allowDeselect: false,
        useComponents: true,
        deselectOnContainerClick: false
    }
});

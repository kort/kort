/*
 * @class Twitter.view.SearchBar
 * @extends Ext.Toolbar
 *
 * Contains the textfield required to perform twitter searchs.
 */
Ext.define('Twitter.view.SearchBar', {
    extend: 'Ext.Toolbar',
    xtype : 'searchbar',
    requires: ['Ext.field.Text', 'Ext.field.Search'],

    config: {
        ui: 'searchbar',
        layout: 'vbox',
        height: '79px',
        cls: 'big',
        height: '4.7em',

        items: [
            {
                xtype: 'title',
                title: 'Twitter Search'
            },
            {
                xtype: 'searchfield',
                placeHolder: 'Search...'
            }
        ]
    }
});

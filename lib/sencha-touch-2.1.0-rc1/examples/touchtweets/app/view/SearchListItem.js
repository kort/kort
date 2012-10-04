/**
 * This is a search list item for the SearchList view. It contains two items:
 * one for the search query, and a Ext.Button which is used to delete
 * searches. (by default this button is hidden).
 */
Ext.define('Twitter.view.SearchListItem', {
    extend: 'Ext.dataview.component.DataItem',
    xtype : 'searchlistitem',

    config: {
        deleteButton: {
            text  : 'Delete',
            ui    : 'decline-small',
            hidden: true
        },

        items: [
            {
                cls : 'search',
                tpl : '{query}',
                flex: 1
            }
        ],

        layout: {
            type : 'hbox',
            align: 'middle'
        }
    },

    /**
     * Returns an instance of a Ext.Button based on the {@link #deleteButton} configuration
     */
    applyDeleteButton: function(config) {
        return Ext.factory(config, Ext.Button, this.getDeleteButton());
    },

    /**
     * When the {@link #deleteButton} configuration is updated, add it to this item.
     */
    updateDeleteButton: function(newDeleteButton) {
        if (newDeleteButton) {
            this.add(newDeleteButton);
        }
    }
});

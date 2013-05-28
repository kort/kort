/**
 * Main container for news detail view.
 */
Ext.define('Kort.view.news.newsEntry.Container', {
    extend: 'Ext.Container',
    alias: 'widget.newscontainer',
    requires: [
        'Ext.Button',
        'Kort.view.news.newsEntry.ContentComponent'
    ],

    config: {
        cls: 'newsNewsEntryContainer',
        scrollable: true,
        layout: 'vbox'
    },

    /**
     * @private
     */
    initialize: function () {
        var newsnewsEntryContentComponent;

        this.callParent(arguments);

        newsnewsEntryContentComponent = {
            xtype: 'newsnewsentrycontentcomponent',
            record: this.getRecord()
        };

        this.add([newsnewsEntryContentComponent]);
    }
});

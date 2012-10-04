Ext.define('Twitter.controller.phone.Search', {
    extend: 'Twitter.controller.Search',

    config: {
        refs: {
            tweetToolbar: 'tweetlist toolbar',
            searchContainer: 'mainview #searchcontainer'
        },

        control: {
            'tweetlist toolbar button': {
                tap: 'onBackButtonTap'
            }
        }
    },

    launch: function() {
        this.callParent(arguments);

        this.getTweetToolbar().show();
    },

    /**
     * Called when the back button is tapped in the toolbar at the top of the tweetsList. Just switches back to the
     * list of saved searches
     */
    onBackButtonTap: function() {
        this.getMain().setActiveItem(this.getSearchContainer());
    },

    onSearchSelect: function(list, search) {
        this.callParent(arguments);

        this.getMain().setActiveItem(this.getTweetList());

        var searchList = this.getSearchList();

        // hack to deselect an item.
        setTimeout(function() {
            searchList.deselect(search);
        }, 500);
    }
});

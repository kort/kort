/*
 * This controller is the main, and only controller for this application. It handles all the views and functionality
 * of this application.
 */
Ext.define('Twitter.controller.Search', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            main: {
                selector  : 'mainview',
                xtype     : 'mainview',
                autoCreate: true
            },
            searchBar: 'searchbar',
            searchList: 'searchlist',
            tweetList: 'tweetlist',
            searchField: 'searchbar > searchfield'
        },

        control: {
            searchField: {
                keyup: 'onSearch'
            },

            tweetList: {
                itemtap: 'onTweetTap'
            },

            searchList: {
                select: 'onSearchSelect',
                itemswipe: 'onSearchSwipe'
            },

            'searchlist searchlistitem button': {
                tap: 'onSearchDelete'
            }
        }
    },

    launch: function() {
        Ext.getStore('Searches').load({
            callback: this.onSearchesStoreLoad,
            scope: this
        });
    },

    /**
     * Called when the searchesStore has been loaded from localStorage. If it is NOT a phone, it will select one of the searches
     * from the list, now that it is loaded.
     * We don't want to select a search when it is loaded on a phone, as it would trigger the tweetList view to display.
     */
    onSearchesStoreLoad: function() {
        var search = Ext.getStore('Searches').getAt(0);

        if (!search) {
            this.doSearch("sencha");
        }
    },

    /**
     * Called when a search is selected from the searchList. It sets the store of the tweetList to the tweets() store of the selected
     * search isntance. If the device is a phone, we set the active item to the tweetList. If it is now, we just ensure the tweetList
     * is visible
     */
    onSearchSelect: function(list, search) {
        var store = search.tweets();

        this.getTweetList().setStore(store);
        store.load();
    },

    /**
     * Called when an item in the searchList is swiped. It will show the delete button in the swiped item.
     */
    onSearchSwipe: function(dataview, index, target) {
        if (Ext.getStore('Searches').getCount() < 2) {
            return;
        }

        //set the currentDeleteButton so we know what is it to hide it in the listener below
        this.currentDeleteButton = target.getDeleteButton();
        this.currentDeleteButton.show();

        //add a listener to the body, so we can hide the button if the user taps anywhere but the button.
        Ext.getBody().on('tap', this.onBodyTap, this);
    },

    /**
     * Called when the user taps on the body. Hides the delete button and removes the listener from the body.
     */
    onBodyTap: function(e) {
        if (this.currentDeleteButton) {
            this.currentDeleteButton.hide();
        }

        //remove the listener
        Ext.getBody().un('tap', this.onBodyTap, this);
    },

    /**
     * Called when a user taps on an item in the tweetList. This is used to check if the element the user tapped on is a hashtag.
     * If it is a hashtag, we get watchever that hashtag is and call {@link #doSearch} with it.
     * We could possibly extend this to users, too.
     */
    onTweetTap: function(list, index, target, record, e) {
        target = Ext.get(e.target);

        if (target && target.dom && target.hasCls('hashtag')) {
            this.doSearch(target.dom.innerHTML);
        }
    },

    /**
     * Called when a use taps the delete button on a searchList item
     */
    onSearchDelete: function(button, e) {
        var item   = button.getParent(),
            search = item.getRecord();

        this.fireAction('destroy', [search, button], 'doDestroy');
    },

    /**
     * Removes a specified search record from the searches store. The tablet controller subclass has some additional
     * logic to select the nearest saved search
     */
    doDestroy: function(search, button) {
        var store = Ext.getStore('Searches');

        store.remove(search);
        store.sync();
        button.hide();
    },

    /**
     * Called on the keyup event of the search field. If the enter/return key was pressed, it will fire the search action.
     */
    onSearch: function(field, e) {
        var keyCode = e.event.keyCode,
            searchField = this.getSearchField();

        //the return keyCode is 13.
        if (keyCode == 13) {
            //fire the search action with the current value of the searchField
            this.fireAction('search', [searchField.getValue()], 'doSearch');
        }
    },

    /**
     * Called with the search action above. Searches twitter for a specified search term or record
     */
    doSearch: function(search) {
        var model         = Twitter.model.Search,
            tweetList     = this.getTweetList(),
            searchList    = this.getSearchList(),
            searchesStore = Ext.getStore('Searches'),
            searchField   = this.getSearchField(),
            query, index;

        // ensure there is a search...
        if (!search) {
            return;
        }

        //ensure the tweetlist is visible
        tweetList.show();

        //check if ths search already exists in the searchesStore
        index = searchesStore.find('query', search);
        if (index != -1) {
            //it exists, so lets just select it
            search = searchesStore.getAt(index);

            searchList.select(search);

            //empty the field and blur it so it looses focus
            searchField.setValue('');
            searchField.blur();

            return;
        }

        //if the passed argument is not an instance of a Search mode, create a new instance
        if (!(search instanceof Twitter.model.Search)) {
            query = search.replace("%20", " ");
            search = new model({
                query: query
            });
        }

        //add the new search instance to the searchsStore
        searchesStore.add(search);
        searchesStore.sync();

        // select the new record in the list
        searchList.select(search);

        //empty the field and remove focus from it
        searchField.setValue('');
        searchField.blur();
    }
});

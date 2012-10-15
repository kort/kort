//<debug>
Ext.Loader.setPath({
    'Ext': '../../src'
});
//</debug>

/**
 * This is a simple demontration of the Ext.List component with a binded Ext.data.Store.
 * It also included a search field which has functionality built in to filter the data in
 * the store, on key up.
 */

//define our application
Ext.application({
    //setup the startup screens and icon for mobile devices
    startupImage: {
        '320x460': 'resources/startup/Default.jpg', // Non-retina iPhone, iPod touch, and all Android devices
        '640x920': 'resources/startup/640x920.png', // Retina iPhone and iPod touch
        '640x1096': 'resources/startup/640x1096.png', // iPhone 5 and iPod touch (fifth generation)
        '768x1004': 'resources/startup/768x1004.png', //  Non-retina iPad (first and second generation) in portrait orientation
        '748x1024': 'resources/startup/748x1024.png', //  Non-retina iPad (first and second generation) in landscape orientation
        '1536x2008': 'resources/startup/1536x2008.png', // : Retina iPad (third generation) in portrait orientation
        '1496x2048': 'resources/startup/1496x2048.png' // : Retina iPad (third generation) in landscape orientation
    },

    isIconPrecomposed: false,
    icon: {
        57: 'resources/icons/icon.png',
        72: 'resources/icons/icon@72.png',
        114: 'resources/icons/icon@2x.png',
        144: 'resources/icons/icon@144.png'
    },

    // require any components we are using in this example
    requires: [
        'Ext.data.Store',
        'Ext.List',
        'Ext.field.Search',
        'Ext.Toolbar',
        'Ext.Panel'
    ],

    /**
     * The launch method is called when the browser is ready, and the application can launch.
     *
     * Inside our launch method we create the list and show in in the viewport. We get the lists configuration
     * using the getListConfiguration method which we defined below.
     *
     * If the user is not on a phone, we wrap the list inside a panel which is centered on the page.
     */
    launch: function() {
        //get the configuration of the list
        var listConfiguration = this.getListConfiguration();

        //check if the device is a phone
        if (!Ext.os.is.Phone) {
            //add a panel into the viewport
            Ext.Viewport.add({
                //panel gets special styling when it is floating
                xtype: 'panel',

                //give it a fixed width and height
                width: 380,
                height: 420,

                //center the panel
                centered: true,

                //modal gives it a mask
                modal: true,

                //disable the hide on mask tap functionality of modal
                hideOnMaskTap: false,

                //give it a fit layout so the list item stretches to the size of this panel
                layout: 'fit',

                //give it 1 item which is the listConfiguration
                items: [listConfiguration]
            }).show();
        } else {
            //add the list into the viewport
            Ext.Viewport.add(listConfiguration);
        }
    },

    /**
     * Returns the configuration of the list for this example, to be inserted into the viewport in the launch method.
     */
    getListConfiguration: function() {
        return {
            //give it an xtype of list
            xtype: 'list',

            ui: 'round',

            pinHeaders: false,

            //itemTpl defines the template for each item in the list
            itemTpl: '<div class="contact">{firstName} <strong>{lastName}</strong></div>',

            //give it a link to the store instance
            store: this.getStore(),


            grouped: true,
            emptyText: '<div style="margin-top: 20px; text-align: center">No Matching Items</div>',
            disableSelection: true,

            items: [
                {
                    xtype: 'toolbar',
                    docked: 'top',

                    items: [
                        { xtype: 'spacer' },
                        {
                            xtype: 'searchfield',
                            placeHolder: 'Search...',
                            listeners: {
                                scope: this,
                                clearicontap: this.onSearchClearIconTap,
                                keyup: this.onSearchKeyUp
                            }
                        },
                        { xtype: 'spacer' }
                    ]
                }
            ]
        };
    },

    /**
     * Returns a new store instance if one hasn't been created yet
     * @return {Ext.data.Store}
     */
    getStore: function() {
        //check if a store has already been set
        if (!this.store) {
            //if not, create one
            this.store = Ext.create('Ext.data.Store', {
                //define the stores fields
                fields: ['firstName', 'lastName'],

                //sort the store using the lastname field
                sorters: 'lastName',

                //group the store using the lastName field
                groupField: 'lastName',

                //and give it some data
                data: [
                    { firstName: 'Tommy',   lastName: 'Maintz' },
                    { firstName: 'Rob',     lastName: 'Dougan' },
                    { firstName: 'Ed',      lastName: 'Avins' },
                    { firstName: 'Jamie',   lastName: 'Avins' },
                    { firstName: 'Dave',    lastName: 'Dougan' },
                    { firstName: 'Abraham', lastName: 'Elias' },
                    { firstName: 'Jacky',   lastName: 'Ngyuyen' },
                    { firstName: 'Jay',   lastName: 'Ngyuyen' },
                    { firstName: 'Jay',     lastName: 'Robinson' },
                    { firstName: 'Rob',   lastName: 'Avins' },
                    { firstName: 'Ed',     lastName: 'Dougan' },
                    { firstName: 'Jamie',    lastName: 'Poulden' },
                    { firstName: 'Dave',      lastName: 'Spencer' },
                    { firstName: 'Abraham',   lastName: 'Avins' },
                    { firstName: 'Jacky',   lastName: 'Avins' },
                    { firstName: 'Rob',    lastName: 'Kaneda' },
                    { firstName: 'Ed', lastName: 'Elias' },
                    { firstName: 'Tommy',    lastName: 'Dougan' },
                    { firstName: 'Rob',     lastName: 'Robinson' }
                ]
            });
        }

        //return the store instance
        return this.store;
    },

    /**
     * Called when the search field has a keyup event.
     *
     * This will filter the store based on the fields content.
     */
    onSearchKeyUp: function(field) {
        //get the store and the value of the field
        var value = field.getValue(),
            store = this.getStore();

        //first clear any current filters on thes tore
        store.clearFilter();

        //check if a value is set first, as if it isnt we dont have to do anything
        if (value) {
            //the user could have entered spaces, so we must split them so we can loop through them all
            var searches = value.split(' '),
                regexps = [],
                i;

            //loop them all
            for (i = 0; i < searches.length; i++) {
                //if it is nothing, continue
                if (!searches[i]) continue;

                //if found, create a new regular expression which is case insenstive
                regexps.push(new RegExp(searches[i], 'i'));
            }

            //now filter the store by passing a method
            //the passed method will be called for each record in the store
            store.filter(function(record) {
                var matched = [];

                //loop through each of the regular expressions
                for (i = 0; i < regexps.length; i++) {
                    var search = regexps[i],
                        didMatch = record.get('firstName').match(search) || record.get('lastName').match(search);

                    //if it matched the first or last name, push it into the matches array
                    matched.push(didMatch);
                }

                //if nothing was found, return false (dont so in the store)
                if (regexps.length > 1 && matched.indexOf(false) != -1) {
                    return false;
                } else {
                    //else true true (show in the store)
                    return matched[0];
                }
            });
        }
    },

    /**
     * Called when the user taps on the clear icon in the search field.
     * It simply removes the filter form the store
     */
    onSearchClearIconTap: function() {
        //call the clearFilter method on the store instance
        this.getStore().clearFilter();
    }
});

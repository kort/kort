//<debug>
Ext.Loader.setPath({
    'Ext': '../../src'
});
//</debug>

/**
 * This is a simple demo of the TabPanel component in Sencha Touch.
 *
 * This is similar to the other tabs example, only the tabbar is docked to the bottom.
 */
Ext.application({
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

    //require any components we use in the application
    requires: [
        'Ext.tab.Panel'
    ],

    /**
     * The launch function is called when the browser and the framework is ready
     * for the application to launch.
     *
     * All we are going to do is create a simple tabpanel with some items, and add
     * it to the global Ext.Viewport instance.
     */
    launch: function() {
        //we send a config block into the Ext.Viewport.add method which will
        //create our tabpanel
        Ext.Viewport.add({
            //first we define the xtype, which is tabpanel for the Tab Panel component
            xtype: 'tabpanel',

            //now we specify the tabBar configuration and give it a docked property of bottom
            //this will dock the tabbar of this tabpanel to the bottom
            tabBar: {
                docked: 'bottom'
            },

            //here we specify the ui of the tabbar to light
            ui: 'light',

            //defaults allow us to add default configuratons for each of the items added into
            //this container. adding scrollable true means that all items in this tabpanel will
            //be scrollable unless otherwise specified in the item configuration
            defaults: {
                scrollable: true
            },

            //next we define the items that will appear inside our tab panel
            items: [
                {
                    //each item in a tabpanel requires the title configuration. this is displayed
                    //on the tab for this item
                    title: 'About',

                    //specify the html to be displayed in this item
                    html: '<h1>Bottom Tabs</h1><p>Docking tabs to the bottom will automatically change their style. The tabs below are type="light" (default type is "dark"). Badges (like the 4 &amp; Long title below) can be added by setting <code>badgeText</code> when creating a tab/card or by using <code>setBadge()</code> on the tab later.</p>',

                    //the iconCls is the cls of the icon to be used on the tab (only works when the tab
                    //bar is docked to the bottom)
                    iconCls: 'info',

                    //custom cls to be added to the item
                    cls: 'card1'
                },
                {
                    title: 'Favorites',
                    html: '<h1>Favorites Card</h1>',
                    iconCls: 'favorites',
                    cls: 'card2',

                    //the badgetext configuration allows us to add a badge/tooltip onto the tab
                    //this is useful when you want to notify users of new content in an unactive tab
                    badgeText: '4'
                },
                {
                    title: 'Downloads',
                    html: '<h1>Downloads Card</h1>',
                    iconCls: 'download',
                    cls: 'card3',
                    badgeText: 'Text can go here too, but it will be cut off if it is too long.'
                },
                {
                    title: 'Settings',
                    html: '<h1>Settings Card</h1>',
                    iconCls: 'settings',
                    cls: 'card4'
                },
                {
                    title: 'User',
                    html: '<h1>User Card</h1>',
                    iconCls: 'user',
                    cls: 'card5'
                }
            ]
        });
    }
});

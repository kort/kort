//<debug>
Ext.Loader.setPath({
    'Ext': '../../src'
});
//</debug>

/**
 * The simple exmaple demontrates using the Ext.Toolbar component. It also shows Ext.Button
 * and Ext.SegmentedButton components in various types of toolbars.
 */

// Define your application
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

    // Require all the components used for this example
    requires: [
        'Ext.SegmentedButton',
        'Ext.Toolbar'
    ],

    /**
     * The launch method is called when the browser is ready, and the application can launch.
     *
     * Within this function we will get the items we are going to display, and then display inside the Ext.Viewport
     */
    launch: function() {
        // Define the items local variable
        var items;

        // Check if the deviceType is not a Phone
        if (Ext.os.deviceType != "Phone") {
            // Get the items for tablet devices
            items = this.getTabletItems();
        } else {
            // Get the items for phone devices
            items = this.getPhoneItems();
        }

        // Add a new item into the viewport
        Ext.Viewport.add({
            // Give it our items to be placed inside
            items: items,

            // Add some default HTML and style it.
            html: 'Pick a button, any button. <br /><small>By using SASS, all of the buttons on this screen can be restyled dynamically. The only images used are masks.</small>',
            styleHtmlContent: true
        });
    },

    /**
     * Returns the items to be displayed when the device is a phone.
     */
    getPhoneItems: function() {
        return [
            // First docked top toolbar
            {
                xtype: 'toolbar',
                docked: 'top',

                // Give it three items; 3 different buttons
                items: [
                    { ui: 'back', text: 'Back' },
                    { text: 'Default' },
                    { ui: 'round', text: 'Round' }
                ]
            },
            // Second docked top toolbar
            {
                xtype: 'toolbar',
                docked: 'top',

                // Give it 1 item which is a segmented button
                items: [
                    {
                        xtype: 'segmentedbutton',
                        items: [
                            { text: 'Option 1' },

                            // Set the second button as pressed
                            { text: 'Option 2', pressed: true },
                            { text: 'Option 3' }
                        ]
                    }
                ]
            },
            // Third docked top toolbar
            {
                xtype: 'toolbar',
                docked: 'top',

                // Give it two buttons
                items: [
                    { ui: 'action', text: 'Action' },
                    { ui: 'forward', text: 'Forward' }
                ]
            },
            // First docked bottom toolbar
            {
                xtype: 'toolbar',
                docked: 'bottom',

                // Give it a ui of light to make it slightly different.
                ui: 'light',

                // Give it one item which is a segmented button
                items: [
                    {
                        xtype: 'segmentedbutton',

                        // Allow multiple selections
                        allowMultiple: true,

                        items: [
                            { text: 'Toggle 1', pressed: true },
                            { text: 'Toggle 2', pressed: true },
                            { text: 'Toggle 3' }
                        ]
                    }
                ]
            }
        ];
    },

    /**
     * Returns the items to be displayed when the device is not a phone.
     */
    getTabletItems: function() {
        return [
            // First docked top toolbar
            {
                xtype: 'toolbar',
                docked: 'top',

                // Make the toolbar scrollable
                scrollable: {
                    direction: 'horizontal',
                    indicators: false
                },

                // Add several items into the toolbar
                items: [
                    { ui: 'back', text: 'Back' },
                    { text: 'Default' },
                    { ui: 'round', text: 'Round' },

                    { xtype: 'spacer' },

                    {
                        xtype: 'segmentedbutton',
                        items: [
                            { text: 'Option 1' },
                            { text: 'Option 2', pressed: true },
                            { text: 'Option 3' }
                        ]
                    },

                    { xtype: 'spacer' },

                    { ui: 'action', text: 'Action' },
                    { ui: 'forward', text: 'Forward' },
                    {
                        xtype: 'segmentedbutton',
                        allowMultiple: true,
                        items: [
                            { text: 'Toggle 1', pressed: true },
                            { text: 'Toggle 2', pressed: true },
                            { text: 'Toggle 3' }
                        ]
                    }
                ]
            },

            // Second docked top toolbar
            {
                xtype: 'toolbar',
                docked: 'top',

                // Make the toolbar scrollable
                scrollable: {
                    direction: 'horizontal',
                    indicators: false
                },

                // Add several items into the toolbar
                items: [
                    { iconMask: true, iconCls: 'action' },
                    { iconMask: true, ui: 'plain', iconCls: 'add' },
                    { iconMask: true, text: 'Test', iconCls: 'action' },
                    { iconMask: true, text: 'Test', ui: 'plain', iconCls: 'bookmarks' },
                    { iconMask: true, ui: 'round', iconCls: 'download' },
                    { iconMask: true, ui: 'action', iconCls: 'settings', badgeText: '2' },
                    { iconMask: true, ui: 'confirm-round', iconCls: 'compose' },
                    { iconMask: true, ui: 'decline', iconCls: 'delete' },
                    { iconMask: true, iconAlign: 'right', ui: 'round', text: 'Home', iconCls: 'home' },
                    { iconMask: true, ui: 'action-round', iconCls: 'locate' },
                    { xtype: 'segmentedbutton', items: [
                      { iconMask: true, iconCls: 'maps' },
                      { iconMask: true, iconCls: 'organize', text: 'Sort' },
                      { iconMask: true, iconCls: 'refresh' }
                    ]},
                    { iconMask: true, ui: 'back', iconCls: 'reply' },
                    { iconMask: true, iconCls: 'x-icon-mask trash' }
                ]
            },

            // Third docked top toolbar
            {
                xtype: 'toolbar',
                docked: 'top',
                scrollable: {
                    direction: 'horizontal',
                    indicators: false
                },
                defaults: {
                    disabled: true,

                    defaults: {
                        disabled: true
                    }
                },
                items: [
                    { iconMask: true, iconCls: 'action' },
                    { iconMask: true, ui: 'plain', iconCls: 'add' },
                    { iconMask: true, text: 'Test', iconCls: 'action' },
                    { iconMask: true, text: 'Test', ui: 'plain', iconCls: 'bookmarks' },
                    { iconMask: true, ui: 'round', iconCls: 'download' },
                    { iconMask: true, ui: 'action', iconCls: 'settings', badgeText: '2' },
                    { iconMask: true, ui: 'confirm-round', iconCls: 'compose' },
                    { iconMask: true, ui: 'decline', iconCls: 'delete' },
                    { iconMask: true, iconAlign: 'right', ui: 'round', text: 'Home', iconCls: 'home' },
                    { iconMask: true, ui: 'action-round', iconCls: 'locate' },
                    { xtype: 'segmentedbutton', items: [
                      { iconMask: true, iconCls: 'maps' },
                      { iconMask: true, iconCls: 'organize', text: 'Sort' },
                      { iconMask: true, iconCls: 'refresh' }
                    ]},
                    { iconMask: true, ui: 'back', iconCls: 'reply' },
                    { iconMask: true, iconCls: 'x-icon-mask trash' }
                ]
            },

            // First docked bottom toolbar
            {
                xtype: 'toolbar',
                docked: 'bottom',

                // Make it scrollable and disable the indicators
                scrollable: {
                    direction: 'horizontal',
                    indicators: false
                },

                // Give it a light UI
                ui: 'light',

                items: [
                    // Three buttons
                    { ui: 'back', text: 'Back' },
                    { text: 'Default' },
                    { ui: 'round', text: 'Round' },

                    // A flexible spacer to sperate the items
                    { xtype: 'spacer' },

                    // Segmented button
                    {
                        xtype: 'segmentedbutton',
                        items: [
                            { text: 'Option 1' },
                            { text: 'Option 2', pressed: true },
                            { text: 'Option 3' }
                        ]
                    },

                    // Another flexible spacer
                    { xtype: 'spacer' },

                    // Two buttons and a segmented button with 3 items.
                    { ui: 'action', text: 'Action' },
                    { ui: 'forward', text: 'Forward' },
                    {
                        xtype: 'segmentedbutton',

                        // Allow multiple pressed buttons
                        allowMultiple: true,

                        items: [
                            { text: 'Toggle 1', pressed: true },
                            { text: 'Toggle 2', pressed: true },
                            { text: 'Toggle 3' }
                        ]
                    }
                ]
            }
        ];
    }
});

//<debug>
Ext.Loader.setPath({
    'Ext': '../../src'
});
//</debug>

/**
 * A simple example of the Ext.picker.Picker component in Sencha Touch.
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

    // Require any components used by this example
    requires: [
        'Ext.data.Store',
        'Ext.picker.Picker',
        'Ext.picker.Date',
        'Ext.Button',
        'Ext.Toolbar',
        'Ext.Panel'
    ],

    launch: function(options) {
        // Create the picker and add it immediately to the viewport.
        this.picker = Ext.Viewport.add({
            xtype: 'datepicker',

            // Disable titles, done button, cancel button and make it hidden by default
            useTitles: false,
            doneButton: false,
            cancelButton: false,
            hidden: true,

            // specify the toolbar configuration and give it a items config
            toolbar: {
                xtype: 'toolbar',
                items: (Ext.os.is.Phone) ? this.getPhoneItems() : this.getTabletItems()
            }
        });

        // Add one button into the viewport and center it horizontally and vertically.
        Ext.Viewport.add({
            xtype: 'container',
            layout: {
                type: 'vbox',
                align: 'center',
                pack: 'center'
            },
            items: [
                {
                    xtype: 'button',
                    ui: 'normal',
                    text: 'Show Picker',
                    scope: this,
                    handler: function() {
                        // When you tap this button, show the picker.
                        this.picker.show();
                    }
                }
            ]
        });
    },

    /**
     * Returns a random number between two specified numbers
     * @return {Number}
     */
    getRandomNumber: function(from, to) {
        return Math.floor(Math.random() * (to - from + 1) + from);
    },

    /**
     * Returns the items for the picker toolbar for phones.
     * @return {Object[]}
     */
    getPhoneItems: function() {
        var getRandomNumber = this.getRandomNumber;

        return [
            {
                text: 'Today',
                scope: this,
                handler: function() {
                    this.picker.setValueAnimated(new Date());
                }
            },
            {
                text: 'Random',
                scope: this,
                handler: function() {
                    this.picker.setValueAnimated({
                        month: getRandomNumber(0, 11),
                        day: getRandomNumber(0, 28),
                        year: getRandomNumber(1980, 2011)
                    });
                }
            },
            {
                text: 'useTitles',
                scope: this,
                handler: function() {
                    this.picker.setUseTitles(!this.picker.getUseTitles());
                }
            },
            { xtype: 'spacer' },
            {
                text: 'Done',
                ui: 'action',
                scope: this,
                handler: function() {
                    this.picker.hide();
                }
            }
        ];
    },

    /**
     * Returns the items for the picker toolbar for tablets.
     * @return {Object[]}
     */
    getTabletItems: function() {
        var getRandomNumber = this.getRandomNumber;

        return [
            {
                text: 'Select Today',
                scope: this,
                handler: function() {
                    this.picker.setValueAnimated(new Date());
                }
            },
            {
                text: 'Select a random date',
                scope: this,
                handler: function() {
                    this.picker.setValueAnimated({
                        month: getRandomNumber(0, 11),
                        day: getRandomNumber(0, 28),
                        year: getRandomNumber(1980, 2011)
                    });
                }
            },
            {
                text: 'Toggle useTitles config',
                scope: this,
                handler: function() {
                    this.picker.setUseTitles(!this.picker.getUseTitles());
                }
            },
            { xtype: 'spacer' },
            {
                text: 'Done',
                ui: 'action',
                scope: this,
                handler: function() {
                    this.picker.hide();
                }
            }
        ];
    }
});

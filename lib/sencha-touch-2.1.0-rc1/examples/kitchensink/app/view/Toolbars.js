/**
 * Demonstrates several options available when using Toolbars
 */
Ext.define('Kitchensink.view.Toolbars', {
    extend: 'Ext.Container',

    requires: [
        'Ext.SegmentedButton'
    ],

    config: {
        cls: 'card',
        html: 'Toolbars automatically come with <code>light</code> and <code>dark</code> UIs, but you can also make your own with Sass.',

        items: !Ext.os.is.Phone ? [
            {
                xtype: 'toolbar',
                ui: 'neutral',
                docked: 'top',
                scrollable: {
                    direction: 'horizontal',
                    indicators: false
                },
                items: [
                    {
                        text: 'Back',
                        ui: 'back'
                    },
                    {
                        text: 'Default',
                        badgeText: '2'
                    },
                    {
                        text: 'Round',
                        ui: 'round'
                    },
                    {
                        xtype: 'spacer'
                    },
                    {
                        xtype: 'segmentedbutton',
                        allowDepress: true,
                        items: [
                            {
                                text: 'Option 1',
                                pressed: true
                            },
                            {
                                text: 'Option 2'
                            },
                            {
                                text: 'Option 3'
                            }
                        ]
                    },
                    {
                        xtype: 'spacer'
                    },
                    {
                        text: 'Action',
                        ui: 'action'
                    },
                    {
                        text: 'Forward',
                        ui: 'forward'
                    }
                ]
            }
        ] : [
            {
                xtype: 'toolbar',
                ui: 'light',
                docked: 'top',
                scrollable: false,
                items: [
                    {
                        xtype: 'spacer'
                    },
                    {
                        text: 'Back',
                        ui: 'back'
                    },
                    {
                        text: 'Default',
                        badgeText: '2'
                    },
                    {
                        text: 'Round',
                        ui: 'round'
                    },
                    {
                        xtype: 'spacer'
                    }
                ]
            },
            {
                xtype: 'toolbar',
                ui: 'dark',
                docked: 'bottom',
                scrollable: false,
                items: [
                    {
                        xtype: 'spacer'
                    },
                    {
                        xtype: 'segmentedbutton',
                        allowDepress: true,
                        items: [
                            {
                                text: 'Option 1',
                                pressed: true
                            },
                            {
                                text: 'Option 2'
                            },
                            {
                                text: 'Option 3'
                            }
                        ]
                    },
                    {
                        xtype: 'spacer'
                    }
                ]
            }
        ]
    },

    // @private
    constructor: function() {
        this.on({
            scope: this,
            delegate: 'button',

            tap: 'tapHandler'
        });

        this.callParent(arguments);
    },

    /**
     * Called when any button in these view is tapped
     */
    tapHandler: function(button) {
        this.setHtml("<span class=action>User tapped " + button.getText() + "</span>");
    }
});

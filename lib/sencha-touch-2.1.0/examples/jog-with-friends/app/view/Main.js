/**
 * This screen is displayed once a user has logged in to Facebook and authorized our app.
 */
Ext.define('JWF.view.Main', {
    extend: 'Ext.Container',
    requires: [
        'JWF.view.run.List',
        'JWF.view.NoFriends'
    ],

    config: {
        layout: 'card',

        items: [
            {
                docked: 'top',
                xtype: 'toolbar',
                id: 'mainToolbar',
                cls: 'jogToolbar',
                items: [
                    {   xtype: 'spacer'   },
                    {
                        xtype: 'button',
                        cls: 'fbButton',
                        iconCls: 'showFormBtn',
                        id: 'showFormButton'
                    },
                    {
                        xtype: 'button',
                        cls: 'fbButton',
                        iconCls: 'signoutBtn',
                        id: 'signout'
                    }
                ]
            }
        ]
    },

    initialize: function() {
        this.callParent();

        // Enable the Tap event on the profile picture in the toolbar, so we can show a logout button
        var meta = Ext.getCmp('signout');
        if (meta) {
            meta.element.on('tap', function(e) {
                meta.fireEvent('tap', meta, e);
            });
        }
    }
});

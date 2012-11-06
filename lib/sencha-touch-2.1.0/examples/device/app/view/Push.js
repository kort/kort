Ext.define('Device.view.Push', {
    extend: 'Ext.navigation.View',
    xtype: 'pushnotifications',

    requires: [
        'Ext.device.Push',
        'Device.view.push.Register'
    ],

    config: {
        navigationBar: false,
        autoDestroy: false,

        items: [
            {
                xtype: 'titlebar',
                docked: 'top',
                items: [
                    {
                        align: 'left',
                        iconCls: 'add',
                        iconMask: true,
                        action: 'new'
                    },
                    {
                        align: 'right',
                        text: 'Done',
                        action: 'register',
                        hidden: true,
                        ui: 'action'
                    }
                ]
            },
            {
                cls: 'logger',
                itemId: 'logger',
                scrollable: true
            }
        ]
    }
});

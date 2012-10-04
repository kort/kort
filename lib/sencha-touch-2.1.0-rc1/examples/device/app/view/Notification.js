/**
 * The notification tap. Used to show off various bits of the {@link Ext.device.Notification} device API.
 */
Ext.define('Device.view.Notification', {
    extend: 'Ext.Container',
    xtype: 'notification',

    requires: [
        'Ext.device.Notification'
    ],

    config: {
        scrollable: true,
        padding: '10 10 0 10',

        defaults: {
            margin: '0 0 10 0',
            xtype: 'button'
        },

        items: [
            {
                xtype: 'title',
                title: 'Standard Notifications'
            },
            {
                text: 'Simple',
                action: 'simple'
            },
            {
                text: 'Multiple Buttons',
                action: 'multiple',
                margin: '0 0 30 0'
            },

            {
                xtype: 'title',
                title: 'Other'
            },
            {
                xtype: 'button',
                text: 'Vibrate',
                action: 'vibrate'
            }
        ]
    }
});

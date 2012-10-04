Ext.define('Device.view.push.Register', {
    extend: 'Ext.form.Panel',
    xtype: 'registerpanel',

    config: {
        items: [
            {
                xtype: 'fieldset',
                title: 'Notification Types',
                items: [
                    {
                        xtype: 'checkboxfield',
                        label: 'Alert',
                        name: 'alert',
                        value: 1,
                        checked: true
                    },
                    {
                        xtype: 'checkboxfield',
                        label: 'Badge',
                        value: 2,
                        name: 'badge'
                    },
                    {
                        xtype: 'checkboxfield',
                        label: 'Sound',
                        value: 4,
                        name: 'sound'
                    }
                ]
            }
        ]
    }
});

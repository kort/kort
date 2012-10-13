Ext.define('Device.view.camera.ImageView', {
    extend: 'Ext.Container',
    xtype: 'imageView',

    config: {
        // layout: 'fit',
        scrollable: true,
        items: [
            {
                docked: 'top',
                xtype: 'toolbar',
                items: [
                    {
                        ui: 'back',
                        text: 'Back'
                    }
                ]
            },
            {
                xtype: 'image',
                cls: 'imageView',
                width: 1000,
                height: 1000
            }
        ]
    }
});
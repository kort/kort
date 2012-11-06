/**
 * The camera tap in the main Viewport. Used to capture a new image, select a image already taken,
 * and to view images captured/selected.
 * Uses the {@link Ext.device.Camera} API.
 */
Ext.define('Device.view.Camera', {
    extend: 'Ext.navigation.View',
    xtype: 'camera',

    requires: [
        'Ext.device.Camera',
        'Device.view.camera.ImageList',
        'Ext.Img'
    ],

    config: {
        title  : 'Camera',
        iconCls: 'photo1',
        autoDestroy: false,

        navigationBar: {
            ui: 'light'
        },

        items: [
            {
                xtype: 'imageList',
                title: 'Photos',
                items: [
                    {
                        ui: 'light',
                        xtype : 'toolbar',
                        docked: 'bottom',
                        layout: {
                            type: 'hbox',
                            pack: 'center'
                        },
                        defaults: {
                            iconMask: true
                        },
                        items: [
                            {
                                text: 'Capture',
                                iconCls: 'photo_black2'
                            },
                            {
                                text: 'Select',
                                iconCls: 'photos2'
                            }
                        ]
                    }
                ]
            }
        ]
    }
});

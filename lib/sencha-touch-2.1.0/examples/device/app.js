//<debug>
Ext.Loader.setPath({
    'Ext': '../../src'
});
//</debug>

Ext.application({
    name: 'Device',

    stores: ['Images'],

    views: [
        'Main',
        'Information',
        'Camera',
        'Contacts',
        'Connection',
        'Notification',
        'Orientation',
        'Geolocation',
        'Push',
        'Purchases'
    ],

    controllers: [
        'Application',
        'Camera',
        'Contacts',
        'Notification',
        'Connection',
        'Push',
        'Purchases',
        'Scheme'
    ],

    launch: function() {
        Ext.create('Device.view.Main');
    }
});

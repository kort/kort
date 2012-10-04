Ext.define('Device.controller.Scheme', {
    extend: 'Ext.app.Controller',

    launch: function() {
        if (Ext.device.Device.scheme) {
            alert('Launched from a URL! ' + Ext.device.scheme.url);
        }

        Ext.device.Device.on('schemeupdate', function(device, scheme) {
            alert(JSON.stringify(url));
        }, this);
    }
});

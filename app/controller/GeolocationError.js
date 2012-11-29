Ext.define('Kort.controller.GeolocationError', {
    extend: 'Ext.app.Controller',
    requires: [
        'Ext.LoadMask'
    ],

    config: {
        views: [
            'overlay.geolocationerror.Panel'
        ],
        refs: {
            geolocationerrorPanel: '#geolocationerrorPanel',
            geolocationerrorReloadButton: '#geolocationerrorReloadButton'
        },
        control: {
            geolocationerrorReloadButton: {
                tap: 'onGeolocationerrorReloadButtonTap'
            }
        }
    },

    onGeolocationerrorReloadButtonTap: function() {
        var me = this;
        me.showLoadMask(Ext.i18n.Bundle.message('geolocationerror.loadmask.message'));
        
        // reload app
        window.location.reload();
    },
    
    showLoadMask: function(message) {
        this.getGeolocationerrorPanel().setMasked({
            xtype: 'loadmask',
            message: message
        });

        Ext.defer(this.hideLoadMask, Kort.util.Config.getTimeout(), this);
    },

    hideLoadMask: function() {
        this.getGeolocationerrorPanel().setMasked(false);
    }
});
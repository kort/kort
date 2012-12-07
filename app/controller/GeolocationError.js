/**
 * Controller for geolocation error overlay
 */
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
    
    // @private
    onGeolocationerrorReloadButtonTap: function() {
        var me = this;
        me.showLoadMask(Ext.i18n.Bundle.message('geolocationerror.loadmask.message'));
        
        // reload app
        window.location.reload();
    },
    
    // @private
    showLoadMask: function(message) {
        this.getGeolocationerrorPanel().setMasked({
            xtype: 'loadmask',
            message: message
        });

        Ext.defer(this.hideLoadMask, Kort.util.Config.getTimeout(), this);
    },

    // @private
    hideLoadMask: function() {
        this.getGeolocationerrorPanel().setMasked(false);
    }
});
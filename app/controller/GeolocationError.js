/**
 * Controller for geolocation error overlay.
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
                tap: '_onGeolocationerrorReloadButtonTap'
            }
        }
    },

    /**
     * @private
     */
    _onGeolocationerrorReloadButtonTap: function() {
        this._showLoadMask(Ext.i18n.Bundle.message('geolocationerror.loadmask.message'));
        window.location.reload();
    },

    /**
     * @private
     * @param {String} message
     */
    _showLoadMask: function(message) {
        this.getGeolocationerrorPanel().setMasked({
            xtype: 'loadmask',
            message: message
        });
        Ext.defer(this._hideLoadMask, Kort.util.Config.getTimeout(), this);
    },

    /**
     * @private
     */
    _hideLoadMask: function() {
        this.getGeolocationerrorPanel().setMasked(false);
    }
});
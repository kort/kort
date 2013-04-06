/**
 * small leaflet plugin to provide i18n functionality for Control.Layers
 */

L.Control.i18nLayers = L.Control.Layers.extend({

    initialize: function (baseLayers, overlays, options) {
        L.setOptions(this, options);

        this._layers = {};
        this._lastZIndex = 0;
        this._handlingClick = false;

        for (var i in baseLayers) {
            if (baseLayers.hasOwnProperty(i)) {
                this._addLayer(baseLayers[i], Ext.i18n.Bundle.message(i));
            }
        }

        for (i in overlays) {
            if (overlays.hasOwnProperty(i)) {
                this._addLayer(overlays[i], Ext.i18n.Bundle.message(i), true);
            }
        }
    }
});

L.control.i18nLayers = function (baseLayers, overlays, options) {
    return new L.Control.i18nLayers(baseLayers, overlays, options);
};

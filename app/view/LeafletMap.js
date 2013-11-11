/**
 * LeafletMap component.
 */
Ext.define('Kort.view.LeafletMap', {
    extend: 'Ext.ux.LeafletMap',
    xtype: 'kortleafletmap',

    config: {
        useCurrentLocation: true,
        enableOwnPositionMarker: true,
        autoMapCenter: false,
        mapOptions: {
            zoom: Kort.util.Config.getLeafletMap().zoom
        },
        tileLayerUrl: Kort.util.Config.getLeafletMap().tileLayerUrl,
        retinaTileLayerUrl: Kort.util.Config.getLeafletMap().retinaTileLayerUrl,
        tileLayerOptions: {
            apikey: Kort.util.Config.getLeafletMap().apikey,
            styleId: Kort.util.Config.getLeafletMap().styleId,
            attribution: Kort.util.Config.getLeafletMap().tileLayerAttribution,
            detectRetina: true
        }
    }
});

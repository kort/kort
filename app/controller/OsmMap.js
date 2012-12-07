/**
 * Controller for map components with osm objects
 */
Ext.define('Kort.controller.OsmMap', {
    extend: 'Ext.app.Controller',

    config: {
        map: null
    },

    /**
     * @private
     * Called when map component gets rendered
     * @param {Ext.ux.LeafletMap} cmp Map component
     * @param {L.Map} map Leaflet map object
     * @param {L.TileLayer} tileLayer Leaflet TileLayer object
     */
    onMaprender: function(cmp, map, tileLayer) {
        var record = this.getDetailComponent().getRecord();

        this.setMap(map);
        cmp.setMapCenter(L.latLng(record.get('latitude'), record.get('longitude')));
        this.renderOsmElement(record);
    },
    
    /**
     * @private
     * Renders OpenStreetMap object from a given Kort.model.Bug instance on map
     * @param {Kort.model.Bug} record Bug which should be rendered
     */
    renderOsmElement: function(record) {
        var me = this,
            url = './server/webservices/osm/' + record.get('osm_type') + '/' + record.get('osm_id');

        Ext.Ajax.request({
            url: url,
            headers: {
                'Content-Type': 'text/xml'
            },
            success: function(response) {
                if(response.responseXML) {
                    me.addFeature(response.responseXML, record);
                }
            }
        });
    },

    /**
     * @private
     * Adds osm object feature to map
     * @param {String} xml OSM-XML data which should be drawn
     * @param {Kort.model.Bug} record Bug which should be rendered
     */
    addFeature: function(xml, record) {
        var icon = Kort.util.Config.getMarkerIcon(record.get('type')),
            layer;

        layer = new L.OSM.DataLayer(xml, {
            styles: {
                node: {
                    clickable: false,
                    icon: icon
                },
                way: {
                    clickable: false,
                    color: Kort.util.Config.getOsmMap().featureColor,
                    opacity: Kort.util.Config.getOsmMap().featureOpacity
                },
                area: {
                    clickable: false,
                    color: Kort.util.Config.getOsmMap().featureColor,
                    opacity: Kort.util.Config.getOsmMap().featureOpacity
                }
            }
        });
        layer.addTo(this.getMap());
        this.setZoomToLayerBounds(layer);
    },
    
    /**
     * @private
     * sets zoomlevel of map to layer bounds
     * @param {L.OSM.DataLayer} layer Layer for zoomlevel
     */
    setZoomToLayerBounds: function(layer) {
        var bounds;
        
        bounds = layer.getBounds();
        // reading private variables to check if layer has any bounds
        if(bounds.hasOwnProperty('_northEast') || bounds.hasOwnProperty('_southWest')) {
            this.getMap().fitBounds(bounds);
        }
    }
});
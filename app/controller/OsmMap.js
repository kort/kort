Ext.define('Kort.controller.OsmMap', {
    extend: 'Ext.app.Controller',

    config: {
        map: null
    },

    onMaprender: function(cmp, map, tileLayer) {
        var record = this.getDetailTabPanel().getRecord();

        this.setMap(map);
        cmp.setMapCenter(L.latLng(record.get('latitude'), record.get('longitude')));
        this.renderOsmElement(record);
    },

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
    
    setZoomToLayerBounds: function(layer) {
        var bounds;
        
        bounds = layer.getBounds();
        // TODO reading private variables to check if layer has any bounds
        if(bounds.hasOwnProperty('_northEast') || bounds.hasOwnProperty('_southWest')) {
            this.getMap().fitBounds(bounds);
        }
    }
});
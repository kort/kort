/**
 * Controller for a map with markers on it
 */
Ext.define('Kort.controller.MarkerMap', {
    extend: 'Ext.app.Controller',

    config: {
        map: null,
        markerLayerGroup: []
    },
    
    /**
     * @private
     * Initilizes the controller
     */
    init: function() {
        var me = this;
        me.callParent(arguments);
        
        // create layer group for bug markers
        me.setMarkerLayerGroup(L.layerGroup());
    },
    
    // @private
    onMapRender: function(cmp, map, tileLayer) {
        var me = this;
        me.setMap(map);

        me.getMarkerLayerGroup().addTo(map);
    },
    
    /**
     * @private
     * Centers map to current position
     */
    centerMapToCurrentPosition: function() {
        // centering map to current position
        this.getMapCmp().setMapCenter(this.getCurrentLocationLatLng(this.getMapCmp()));
    },

    /**
     * @private
     * Removes old and draws new markers
     * @param {Ext.data.Model[]} records Array of records from store
     */
	redrawMarkers: function(records) {
        var me = this;

        me.removeAllMarkers();

        // add markers
        Ext.each(records, function (record, index, length) {
            if(record.get('longitude') && record.get('longitude')) {
                me.addMarker(record);
            }
        });
	},
    
    /**
     * @private
     * Removes all markers from map
     */
    removeAllMarkers: function() {
        this.getMarkerLayerGroup().clearLayers();
    },

    /**
     * @private
     * Adds marker for given record
     * @param {Ext.data.Model} record A record
     */
    addMarker: function(record) {
        var me = this,
            icon,
            marker;

        icon = Kort.util.Config.getMarkerIcon(record.get('type'));
        marker = L.marker([record.get('latitude'), record.get('longitude')], {
            icon: icon
        });

        marker.record = record;
        marker.lastClickTimestamp = 0;
        marker.on('click', me.onMarkerClick, me);
        me.getMarkerLayerGroup().addLayer(marker);
    },

    /**
	 * @private
	 * Returns current location
     * @param {Ext.ux.LeafletMap} mapCmp LeafletMap component
	 */
	getCurrentLocationLatLng: function(mapCmp) {
		if(mapCmp.getUseCurrentLocation()) {
            var geo = mapCmp.getGeo();
			return L.latLng(geo.getLatitude(), geo.getLongitude());
		} else {
			return mapCmp.getMap().getCenter();
		}
	},

    // @private
    refreshView: function() {
        //<debug warn>
        Ext.Logger.warn("Implement refreshView method", this);
        //</debug>
    },

    // @private
    onMarkerClick: function() {
        //<debug warn>
        Ext.Logger.warn("Implement onMarkerClick method", this);
        //</debug>
    }
});
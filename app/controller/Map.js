Ext.define('OpenLayersApp.controller.Map', {
    extend: 'Ext.app.Controller',
	
    config: {
        refs: {
			openLayersMap: '#openlayersmap'
        },
		control: {
			openLayersMap: {
				maprender: 'onMapRender'
			}
		},
		
		markersLayer: null,
		markers: []
    },
	
	onMapRender: function(component, map, layer) {
		this.createMarkersLayer(map);
		
		var size = new OpenLayers.Size(21,25);
		var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
		var icon = new OpenLayers.Icon('http://www.openlayers.org/dev/img/marker.png', size, offset);
		var lonlat = new OpenLayers.LonLat(component.getGeo().getLongitude(), component.getGeo().getLatitude());
		
		this.addMarker(lonlat, icon);
	},
	
	createMarkersLayer: function(map) {
		this.setMarkersLayer(new OpenLayers.Layer.Markers("Markers"));
		map.addLayer(this.getMarkersLayer());
	},
	
	addMarker: function(position, icon) {
		this.getOpenLayersMap().transformLonLatObject(position);
		var marker = new OpenLayers.Marker(position, icon);
		this.getMarkers().push(marker);
		this.getMarkersLayer().addMarker(marker);
	}
});
Ext.define('OpenLayersApp.controller.Map', {
    extend: 'Ext.app.Controller',
	
    config: {
        refs: {
			openlayersmap: '#openlayersmap'
        },
		control: {
			openlayersmap: {
				maprender: 'onMapRender',
				zoomend: 'onZoomEnd'
			}
		}
    },
	
	onMapRender: function(component, map, layer) {
		console.log("map render event recieved! :)");
	},
	onZoomEnd: function(component, map) {
		console.log("zoom end");
	}
});
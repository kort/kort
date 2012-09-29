Ext.define('OpenLayersApp.controller.Map', {
    extend: 'Ext.app.Controller',
	
    config: {
        refs: {
			openlayersmap: '#openlayersmap'
        },
		control: {
			openlayersmap: {
				maprender: 'onMapRender',
				zoomend: 'onZoomEnd',
				movestart: 'onMoveStart',
				moveend: 'onMoveEnd'
			}
		}
    },
	
	onMapRender: function(component, map, layer) {
		console.log("map render event recieved! :)");
	},
	onZoomEnd: function(component, map, layer, zoom) {
		console.log("zoom end. new zoom: " + zoom);
	},
	onMoveStart: function(component, map, layer) {
		console.log("move start");
	},
	onMoveEnd: function(component, map, layer) {
		console.log("move end");
	}
});
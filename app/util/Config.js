Ext.define('Kort.util.Config', {
	singleton: true,

	config: {
		leafletMap: {
            zoom: 15,
			tileLayerUrl: 'http://{s}.tile.cloudmade.com/{apikey}/{styleId}/256/{z}/{x}/{y}.png',
			apiKey: '729242682cb24de8aa825c8aed993cba',
            styleId: 997
		},
        // default timeout for load tasks in ms
        timeout: 10000,
        bugs: {
            radius: 5000
        },
        zIndex: {
            overlayLeafletMap: 1500,
            overlayOverlayPanel: 1600
        } 
	},
	
	constructor: function(config) {
		this.initConfig(config);
		return this;
	}
});
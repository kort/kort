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
        },
        fixMap: {
            featureColor: '#FF0000',
            featureFillColor: '#FF0000'
        }
	},
	
	constructor: function(config) {
		this.initConfig(config);
		return this;
	},
    
    getMarkerIcon: function(type) {
        var iconWidth = 32,
            iconHeight = 37,
            shadowWidth = 51,
            shadowHeight = 37,
            icon;

        icon = L.icon({
            iconUrl: './resources/images/marker_icons/' + type + '.png',
            iconSize: [iconWidth, iconHeight],
            iconAnchor: [(iconWidth/2), iconHeight],
            shadowUrl: './resources/images/marker_icons/shadow.png',
            shadowSize: [shadowWidth, shadowHeight],
            shadowAnchor: [(iconWidth/2), shadowHeight],
            popupAnchor: [0, -(2*iconHeight/3)]
        });
        return icon;
    }
});
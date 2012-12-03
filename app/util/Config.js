Ext.define('Kort.util.Config', {
	singleton: true,

	config: {
        version: '0.5.0',
        
		leafletMap: {
            zoom: 15,
			tileLayerUrl: 'http://{s}.tile.cloudmade.com/{apikey}/{styleId}/256/{z}/{x}/{y}.png',
            tileLayerAttribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>',
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
        osmMap: {
            featureColor: '#FF0000',
            featureOpacity: 0.7
        },
        about: {
            authors: [
                'Stefan Oderbolz',
                'Jürg Hunziker'
            ],
            project: 'HSR Bachelorarbeit HS2012/13',
            partners: ['bigforge AG (<a href="http://bitforge.ch" target="_blank">http://bitforge.ch</a>)']
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
/**
 * Configuration for kort application
 */
Ext.define('Kort.util.Config', {
	singleton: true,

	config: {
        /**
         * @cfg {String} version Current version number of application
         */
        version: '0.5.0',
        
        /**
         * @cfg {Object} leafletMap Configuration for {@link Ext.ux.LeafletMap} component
         * @cfg {Number} [leafletMap.zoom=15] (required) Default zoom level of leaflet map
         * @cfg {String} [leafletMap.tileLayerUrl="http://{s}.tile.cloudmade.com/{apikey}/{styleId}/256/{z}/{x}/{y}.png"] (required) URL to tile server
         * @cfg {String} [leafletMap.tileLayerAttribution="Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>"] (required) Copyright information of map
         * @cfg {String} [leafletMap.apiKey=729242682cb24de8aa825c8aed993cba] (required) API key for cloudmade tiles
         * @cfg {Number} [leafletMap.styleId=997] (required) Style id for cloudmade tiles
         */
		leafletMap: {
            zoom: 15,
			tileLayerUrl: 'http://{s}.tile.cloudmade.com/{apikey}/{styleId}/256/{z}/{x}/{y}.png',
            tileLayerAttribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>',
			apiKey: '729242682cb24de8aa825c8aed993cba',
            styleId: 997
		},
        
        /**
         * @cfg {Object} oAuth Configuration for OAuth 
         * @cfg {Object} oAuth.google (required) Configuration for Google OAuth
         * @cfg {String} [oAuth.google.url="https://accounts.google.com/o/oauth2/auth"] (required) URL to Google OAuth
         * @cfg {String[]} oAuth.google.scopes (required) Configuration for Google OAuth
         * @cfg {String} [oAuth.google.redirect_path="server/oauth2callback"] (required) Redirect path after login
         * @cfg {String} [oAuth.google.client_id="653755350671.apps.googleusercontent.com"] (required) Google OAuth client id
         */
        oAuth: {
            google: {
                url: 'https://accounts.google.com/o/oauth2/auth',
                scopes: [
                    'https://www.googleapis.com/auth/userinfo.profile',
                    'https://www.googleapis.com/auth/userinfo.email'
                ],
                redirect_path: 'server/oauth2callback',
                response_type: 'code',
                access_type: 'offline',
                client_id: '653755350671.apps.googleusercontent.com'
            }
        },
        
        /**
         * @cfg {Number} timeout Default timeout for load tasks in ms
         */
        timeout: 10000,
        
        /**
         * @cfg {Object} bugs Configuration for bug to load
         * @cfg {Object} [bugs.radius=5000] (required) Radius for bug selection
         */
        bugs: {
            radius: 5000
        },
        
        /**
         * @cfg {Object} zIndex zIndex for components
         * @cfg {Number} [zIndex.overlayLeafletMap=1500] (required) zIndex for panel to overlay leaflet map components
         * @cfg {Number} [zIndex.overlayOverlayPanel=1600] (required) zIndex for panel to overlay another overlay panel
         */
        zIndex: {
            overlayLeafletMap: 1500,
            overlayOverlayPanel: 1600
        },
        
        /**
         * @cfg {Object} osmMap Style configuration for osm objects
         * @cfg {String} [osmMap.featureColor="#FF0000"] (required) Color of features
         * @cfg {Number} [osmMap.featureOpacity=0.7] (required) Opacity of features
         */
        osmMap: {
            featureColor: '#FF0000',
            featureOpacity: 0.7
        },
        
        /**
         * @cfg {String} kortTitle App title which can be used in content
         */
        kortTitle: '<span class="kort-title"><span class="kort-k">K</span><span class="kort-ort">ORT</span></span>',
        
        /**
         * @cfg {Object} about Labels for about page
         * @cfg {String[]} about.authors (required) Authors of application
         * @cfg {String} [about.project="HSR Bachelorarbeit HS2012/13"] (required) Title of project
         * @cfg {String[]} about.partners (required) Project partners
         */
        about: {
            authors: [
                'Stefan Oderbolz',
                'Jürg Hunziker'
            ],
            project: 'HSR Bachelorarbeit HS2012/13',
            partners: ['bitforge AG (<a href="http://bitforge.ch" target="_blank">http://bitforge.ch</a>)']
        },
        
        /**
         * @cfg {Object} formPlaceholders Ext.i18n.bundle plugin doesn't work for form placeholders so these are stored in config file
         * @cfg {String} [formPlaceholders.username="Benutzername"] (required) Translation of username
         */
        formPlaceholders: {
            username: 'Benutzername'
        }
	},
	
    /**
     * @private
     * initializes the configuration
     */
	constructor: function(config) {
		this.initConfig(config);
		return this;
	},
    
    /**
     * Returns a Leaflet marker icon for a given type
     * @param {String} type Type of marker
     */
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
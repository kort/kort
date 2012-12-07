/**
 * Configuration for kort application
 */
Ext.define('Kort.util.Config', {
	singleton: true,

	config: {
        /**
         * @cfg
         * Current version number of application
         */
        version: '0.5.0',
        
        /**
         * @cfg
         * Configuration for {Ext.ux.LeafletMap} component
         */
		leafletMap: {
            zoom: 15,
			tileLayerUrl: 'http://{s}.tile.cloudmade.com/{apikey}/{styleId}/256/{z}/{x}/{y}.png',
            tileLayerAttribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>',
			apiKey: '729242682cb24de8aa825c8aed993cba',
            styleId: 997
		},
        
        /**
         * @cfg
         * Configuration for oauth logins
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
         * @cfg
         * Default timeout for load tasks in ms
         */
        timeout: 10000,
        
        /**
         * @cfg
         * Configuration for bug to load
         */
        bugs: {
            radius: 5000
        },
        
        /**
         * @cfg
         * zIndex for components
         */
        zIndex: {
            overlayLeafletMap: 1500,
            overlayOverlayPanel: 1600
        },
        
        /**
         * @cfg
         * Style configuration for osm objects
         */
        osmMap: {
            featureColor: '#FF0000',
            featureOpacity: 0.7
        },
        
        /**
         * @cfg
         * App title which can be used in content
         */
        kortTitle: '<span class="kort-title"><span class="kort-k">K</span><span class="kort-ort">ORT</span></span>',
        
        /**
         * @cfg
         * Lables for about page
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
         * @cfg
         * Ext.i18n.bundle plugin doesn't work for form placeholders so these are stored in config file
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
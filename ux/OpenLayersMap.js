/**
 * Wraps an OpenLayers map in an {@link Ext.Component} using the [OpenLayers API](http://dev.openlayers.org/apidocs/).
 *
 * To use this component you must include an additional JavaScript file from OpenLayers:
 *
 *     <script type="text/javascript" src="http://openlayers.org/api/OpenLayers.mobile.js"></script>
 *
 * ## Example
 * 
 *     Ext.Viewport.add({
 *         xtype: 'openlayersmap',
 *         useCurrentLocation: true
 *     });
 *
 */
Ext.define('Ext.ux.OpenLayersMap', {
	extend: 'Ext.Container',
	xtype: 'openlayersmap',
	requires: ['Ext.util.Geolocation'],

	config: {
		/**
		 * @cfg {String} baseCls
		 * The base CSS class to apply to the map's element
		 * @accessor
		 */
		baseCls: Ext.baseCSSPrefix + 'map',

		/**
		 * @cfg {Boolean/Ext.util.Geolocation} useCurrentLocation
		 * Pass in true to center the map based on the geolocation coordinates or pass a
		 * {@link Ext.util.Geolocation GeoLocation} config to have more control over your GeoLocation options
		 * @accessor
		 */
		useCurrentLocation: false,

		/**
		 * @cfg {OpenLayers.Map} map
		 * The wrapped map.
		 * @accessor
		 */
		map: null,

		/**
		 * @cfg {Object} mapOptions
		 * MapOptions as specified by the OpenLayers documentation:
		 * [http://dev.openlayers.org/apidocs/files/OpenLayers/Map-js.html](http://dev.openlayers.org/apidocs/files/OpenLayers/Map-js.html)
		 * @accessor
		 */
		mapOptions: {},

		/**
		 * @cfg {String} layerKey
		 * Class-name of the layer which should be displayed. For example 'OSM' generates a OpenLayers.Layer.OSM layer
		 * @accessor
		 */
		layerKey: 'OSM',
		
		/**
		 * @cfg {Object} layerOptions
		 * Layer options which should be used in the layer
		 * @accessor
		 */
		layerOptions: {},

		/**
		 * @cfg {OpenLayers.Layer.XYZ} layer
		 * The wrapped layer.
		 * @accessor
		 */
		layer: null,

		/**
		 * @cfg {Ext.util.Geolocation} geo
		 * Geolocation provider for the map.
		 * @accessor
		 */
		geo: null,
		
		/**
		 * @cfg {Boolean} autoMapCenter
		 * Defines if the map should automatically center itself on a geoupdate event.
		 * Only applies if {@link Ext.ux.OpenLayersMap#useCurrentLocation} is set to true.
		 * @accessor
		 */
		autoMapCenter: false,
		
		/**
		 * @cfg {Boolean} initialCenter
		 * Defines if the map initially should be centered to the current location.
		 * @accessor
		 */
		initialCenter: true,
		
		/**
		 * @cfg {Object} transformProjections
		 * @cfg {OpenLayers.Projection} [transformProjections.from="EPSG:4326"]
		 * @cfg {OpenLayers.Projection} [transformProjections.to="EPSG:3857"]
		 * If set all LonLat-Objects will be transformed to given projection.
		 * @accessor
		 */
		transformProjections: null
	},
	
	constructor: function() {
        this.callParent(arguments);
		
		var ol = window.OpenLayers;
		
        if (!ol) {
            this.setHtml('OpenLayers API is required');
        } else {
			// set default config values
			if(!this.getTransformProjections()) {
				this.setTransformProjections({
					from: new ol.Projection("EPSG:4326"),
					to: new ol.Projection("EPSG:3857")
				});
			}
			this.setLayer(new ol.Layer[this.getLayerKey()](this.getLayerOptions()));
		}
		
		this.addEvents(
			/**
             * @event maprender
		     * Fired when map is initially rendered.
			 * @param {Ext.ux.OpenLayersMap} this
			 * @param {OpenLayers.Map} map The rendered OpenLayers.Map instance
			 * @param {OpenLayers.Layer.XYZ} layer The rendered OpenLayers.Layer.XYZ instance
			 */
			"maprender",
			
		    /**
             * @event zoomend
             * Fired when a map zoom ended.
             * @param {Ext.ux.OpenLayersMap} this
             * @param {OpenLayers.Map} map The rendered OpenLayers.Map instance
             * @param {OpenLayers.Layer.XYZ} layer The rendered OpenLayers.Layer.XYZ instance
             * @param {Number} zoom The current zoom level of the map
             */
			"zoomend",
		
			/**
			 * @event movestart
			 * Fired when a panning on map starts.
			 * @param {Ext.ux.OpenLayersMap} this
			 * @param {OpenLayers.Map} map The rendered OpenLayers.Map instance
			 * @param {OpenLayers.Layer.XYZ} layer The rendered OpenLayers.Layer.XYZ instance
			 */
			"movestart",
		
			/**
			 * @event moveend
			 * Fired when a panning on map ends.
			 * @param {Ext.ux.OpenLayersMap} this
			 * @param {OpenLayers.Map} map The rendered OpenLayers.Map instance
			 * @param {OpenLayers.Layer.XYZ} layer The rendered OpenLayers.Layer.XYZ instance
			 */
			"moveend"
		);
    },
	
	getElementConfig: function() {
		return {
			reference: 'element',
			className: 'x-container',
			children: [{
				reference: 'innerElement',
				className: 'x-inner',
				children: [{
					reference: 'mapContainer',
					className: Ext.baseCSSPrefix + 'map-container'
				}]
			}]
		};
	},
	
	applyMapOptions: function(mapOptions) {
        return Ext.merge({}, this.options, mapOptions);
    },

    updateMapOptions: function(newMapOptions) {
        var me = this,
            map = this.getMap();

        if (window.OpenLayers && map) {
			map.setOptions(newMapOptions);
        }
        if (newMapOptions.center && !me.isPainted()) {
            me.un('painted', 'setMapCenter', this);
            me.on('painted', 'setMapCenter', this, { delay: 150, single: true, args: [newMapOptions.center] });
        }
    },

    getMapOptions: function() {
        return Ext.merge({}, this.options || this.getInitialConfig('mapOptions'));
    },

    updateUseCurrentLocation: function(useCurrentLocation) {
		var me = this;
		
        me.setGeo(useCurrentLocation);
        if (!this.getMap() && (!useCurrentLocation || !this.getInitialCenter())) {
			me.renderMap();
        }
    },

    applyGeo: function(config) {
        return Ext.factory(config, Ext.util.Geolocation, this.getGeo());
    },

    updateGeo: function(newGeo, oldGeo) {
        var events = {
            locationupdate : 'onGeoUpdate',
            locationerror : 'onGeoError',
            scope : this
        };

        if (oldGeo) {
            oldGeo.un(events);
        }

        if (newGeo) {
            newGeo.on(events);
            newGeo.updateLocation();
        }
    },
	
	/**
     * Moves the map center to the designated coordinates hash of the form:
     *
     *     { longitude: 8.539183, latitude: 47.36865 }
     *
     * or a OpenLayers.LonLat object representing to the target location.
     *
     * @param {Object/OpenLayers.LonLat} coordinates Object representing the desired longitude and
     * latitude upon which to center the map.
     */
	setMapCenter: function(coordinates) {
        var me = this,
            map = me.getMap(),
            ol = window.OpenLayers;

        if (ol) {
            if (!me.isPainted()) {
                me.un('painted', 'setMapCenter', this);
                me.on('painted', 'setMapCenter', this, { delay: 150, single: true, args: [coordinates] });
                return;
            }
			
			coordinates = coordinates || new ol.LonLat(8.539183, 47.36865);
			
            if (coordinates && !(coordinates instanceof ol.LonLat) && 'longitude' in coordinates) {
                coordinates = new ol.LonLat(coordinates.longitude, coordinates.latitude);
            }
			
			if (!map) {
                me.renderMap();
                map = me.getMap();
            }
			
			me.transformLonLatObject(coordinates);
			
            if (map && coordinates instanceof ol.LonLat) {
				map.setCenter(coordinates, me.getMapOptions().zoom);
            } else {
				this.options = Ext.apply(this.getMapOptions(), {
					center: coordinates
				});
			}
        }
    },
	
	/**
     * Transforms the given LonLat object with the configured transform projections.
	 * This transformation is in place: if you want a new LonLat object, use .clone() first.
     *
     * @param {OpenLayers.LonLat} position Object representing the desired longitude and latitude.
     */
	transformLonLatObject: function(position) {
		if(this.getTransformProjections()) {
			position.transform(this.getTransformProjections().from, this.getTransformProjections().to);
		}
	},
	
    // @private
	renderMap: function() {
		var me = this,
			ol = window.OpenLayers,
			element = me.mapContainer,
			map = me.getMap(),
			mapOptions = me.getMapOptions(),
			layer = me.getLayer(),
			events;
		
		// if map isn't painted yet -> recall method after a certain time
		if (!me.isPainted()) {
			me.un('painted', 'renderMap', this);
			me.on('painted', 'renderMap', this, { delay: 150, single: true, args: [] });
			return;
		}
		
		if (ol) {
			if (element.dom.firstChild) {
				Ext.fly(element.dom.firstChild).destroy();
			}
			
			// if no center property is given -> use default position
            if (!mapOptions.hasOwnProperty('center') || !(mapOptions.center instanceof ol.LonLat)) {
                mapOptions.center = new ol.LonLat(8.539183, 47.36865); // default: Zuerich
            }
			
			me.transformLonLatObject(mapOptions.center);
			
			mapOptions.layers = [layer];
			
			me.setMap(new ol.Map(element.dom, mapOptions));
			map = me.getMap();
			
			// track map events
			events = map.events;
			events.register('zoomend', me, me.onZoomEnd);
			events.register('movestart', me, me.onMoveStart);
			events.register('moveend', me, me.onMoveEnd);

			me.fireEvent('maprender', me, map, layer);
		}
	},
	
	// @private
    onGeoUpdate: function(geo) {
        if (geo && (this.getAutoMapCenter() || this.getInitialCenter())) {
            this.setMapCenter(new window.OpenLayers.LonLat(geo.getLongitude(), geo.getLatitude()));
			this.setInitialCenter(false);
        }
    },
	
    // @private
    onGeoError: Ext.emptyFn,
	
	// @private
    onZoomEnd : function() {
        var mapOptions = this.getMapOptions(),
            map = this.getMap(),
			layer = this.getLayer(),
            zoom;

        zoom = map.getZoom() || 10;

        this.options = Ext.apply(mapOptions, {
            zoom: zoom
        });
		
        this.fireEvent('zoomend', this, map, layer, zoom);
    },
	
	// @private
    onMoveStart : function() {
		var map = this.getMap(),
			layer = this.getLayer();
		
        this.fireEvent('movestart', this, map, layer);
    },
	
	// @private
    onMoveEnd : function() {
		var map = this.getMap(),
			layer = this.getLayer();
		
        this.fireEvent('moveend', this, map, layer);
    },
	
	// @private
    destroy: function() {
        Ext.destroy(this.getGeo());
        var map = this.getMap();

        if (map) {
            map.destroy();
        }

        this.callParent();
    }
});
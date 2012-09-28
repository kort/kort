/**
 * Wraps an OpenLayers map in an Ext.Component using the [OpenLayers API](http://dev.openlayers.org/apidocs/).
 *
 * To use this component you must include an additional JavaScript file from OpenLayers:
 *
 *     <script type="text/javascript" src="http://openlayers.org/api/OpenLayers.js"></script>
 *
 * ## Example
 *
 *     Ext.Viewport.add({
 *         xtype: 'openlayersmap',
 *         useCurrentLocation: true
 *     });
 *
 * @aside example maps
 */
Ext.define('OpenLayersApp.view.OpenLayers', {
	extend: 'Ext.Container',
	xtype: 'openlayersmap',
	requires: ['Ext.util.Geolocation'],

	config: {
		/**
		 * @cfg {String} baseCls
		 * The base CSS class to apply to the Map's element
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
		 * @cfg {Object} mapOptions
		 * MapOptions as specified by the OpenLayers documentation:
		 * http://dev.openlayers.org/docs/files/OpenLayers/Map-js.html#OpenLayers.Map.OpenLayers.Map
		 * @accessor
		 */
		mapOptions: {},
		
		/**
		 * @cfg {Boolean} autoMapCenter
		 * Defines if the map should automatically center itself on an geoupdate event
		 * @accessor
		 */
		autoMapCenter: false,
		
		/**
		 * @cfg {Boolean} autoMapCenter
		 * Specifies the coordinates transformation function which is applied everytime a new LonLat object is used
		 * @accessor
		 */
		transformLonLatFn: null
	},
	
	constructor: function() {
        this.callParent(arguments);

        if (!window.OpenLayers) {
            this.setHtml('OpenLayers API is required');
        }
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
        if (!this.getMap() && (!useCurrentLocation || !this.getAutoMapCenter())) {
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
	
	renderMap: function() {
		var me = this,
			ol = window.OpenLayers,
			element = me.mapContainer,
			map = me.getMap(),
			mapOptions = me.getMapOptions(),
			layer = me.getLayer(),
			events,
			mapOptionsTmp;
		
		if (!me.isPainted()) {
			me.un('painted', 'renderMap', this);
			me.on('painted', 'renderMap', this, { delay: 150, single: true, args: [] });
			return;
		}
		
		if (ol) {
			if (element.dom.firstChild) {
				Ext.fly(element.dom.firstChild).destroy();
			}
			
			// This is done separately from the above merge so we don't have to instantiate
            // a new LatLng if we don't need to
            if (!mapOptions.hasOwnProperty('center') || !(mapOptions.center instanceof ol.LonLat)) {
                mapOptions.center = new ol.LonLat(8.539183, 47.36865); // default: Zuerich
            }
			
			mapOptionsTmp = Ext.clone(mapOptions);
			if(me.transformLonLatFn) {
				
			}
			if(me.getTransformLonLatFn()) {
				mapOptionsTmp.center = me.getTransformLonLatFn().call(me, mapOptions.center.clone());
			}
			
			me.setMap(new ol.Map(element.dom, mapOptionsTmp));
			map = me.getMap();
			
			me.setLayer(new ol.Layer.OSM());
			layer = me.getLayer();
			map.addLayer(layer);
			
			//Track zoomLevel and mapType changes
			events = map.events;
			events.register('zoomend', me, me.onZoomEnd);

			me.fireEvent('maprender', me, map, layer);
		}
	},
	
	/**
     * Moves the map center to the designated coordinates hash of the form:
     *
     *     { latitude: 37.381592, longitude: -122.135672 }
     *
     * or a OpenLayers.LonLat object representing to the target location.
     *
     * @param {Object/OpenLayers.LonLat} coordinates Object representing the desired Latitude and
     * longitude upon which to center the map.
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
                coordinates = new ol.LatLng(coordinates.longitude, coordinates.latitude);
            }
			
			if(me.getTransformLonLatFn()) {
				var position = me.getTransformLonLatFn().call(me, coordinates.clone());
			}
			
			if (!map) {
                me.renderMap();
                map = me.getMap();
            }
			
            if (map) {
				map.setCenter(position);
            }
            else {
                this.options = Ext.apply(this.getMapOptions(), {
                    center: position
                });
            }
        }
    },
	
	// @private
    onGeoUpdate: function(geo) {
		console.log("geoupdate");
        if (geo && this.getAutoMapCenter()) {
            this.setMapCenter(new window.OpenLayers.LonLat(geo.getLongitude(), geo.getLatitude()));
        }
    },
	
    // @private
    onGeoError: Ext.emptyFn,
	
	// @private
    onZoomEnd : function() {
        var mapOptions = this.getMapOptions(),
            map = this.getMap(),
            zoom;

        zoom = map.getZoom() || 10;

        this.options = Ext.apply(mapOptions, {
            zoom: zoom
        });
		
        this.fireEvent('zoomend', this, map, zoom);
    }
});
   
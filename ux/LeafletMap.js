/**
 * Wraps a Leaflet map in an {@link Ext.Component} using the [Leaflet API](http://leaflet.cloudmade.com/reference.html).
 *
 * To use this component you must include an additional JavaScript an a CSS file from Leaflet:
 *
 *     <script type="text/javascript" src="http://cdn.leafletjs.com/leaflet-0.4.5/leaflet.js"></script>
 *     <link rel="stylesheet" type="text/css" href="http://cdn.leafletjs.com/leaflet-0.4.5/leaflet.css">
 *
 * ## Example
 * 
 *     Ext.Viewport.add({
 *         xtype: 'leafletmap',
 *         useCurrentLocation: true
 *     });
 *
 */
Ext.define('Ext.ux.LeafletMap', {
    extend: 'Ext.Container',
    xtype: 'leafletmap',
    requires: ['Ext.util.Geolocation'],

    config: {
        /**
         * @event maprender
         * Fired when map is initially rendered.
         * @param {Ext.ux.LeafletMap} this
         * @param {L.Map} map The rendered L.Map instance
         * @param {L.TileLayer} tileLayer The rendered L.TileLayer instance
         */

        /**
         * @event zoomend
         * Fired when a map zoom ended.
         * @param {Ext.ux.LeafletMap} this
         * @param {L.Map} map The rendered L.Map instance
         * @param {L.TileLayer} tileLayer The rendered L.TileLayer instance
         * @param {Number} zoom The current zoom level of the map
         */

        /**
         * @event movestart
         * Fired when a panning on map starts.
         * @param {Ext.ux.LeafletMap} this
         * @param {L.Map} map The rendered L.Map instance
         * @param {L.TileLayer} tileLayer The rendered L.TileLayer instance
         */

        /**
         * @event moveend
         * Fired when a panning on map ends.
         * @param {Ext.ux.LeafletMap} this
         * @param {L.Map} map The rendered L.Map instance
         * @param {L.TileLayer} tileLayer The rendered L.TileLayer instance
         */

        /**
         * @cfg {String} baseCls
         * The base CSS class to apply to the map's element
         * @accessor
         */
        baseCls: Ext.baseCSSPrefix + 'llmap',

        /**
         * @cfg {Boolean/Ext.util.Geolocation} useCurrentLocation
         * Pass in true to center the map based on the geolocation coordinates or pass a
         * {@link Ext.util.Geolocation GeoLocation} config to have more control over your GeoLocation options
         * @accessor
         */
        useCurrentLocation: false,

        /**
         * @cfg {L.Map} map
         * The wrapped map.
         * @accessor
         */
        map: null,

        /**
         * @cfg {Object} mapOptions
         * MapOptions as specified by the Leaflet documentation:
         * [http://leaflet.cloudmade.com/reference.html#map-options](http://leaflet.cloudmade.com/reference.html#map-options)
         * @accessor
         */
        mapOptions: {},

        /**
         * @cfg {String} [tileLayerUrl="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"]
         * URL template for tile-layer in the following form
         * 
         *     'http://{s}.somedomain.com/blabla/{z}/{x}/{y}.png'
         * 
         * {s} means one of the randomly chosen subdomains (their range is specified in options; a, b or c by default, 
         * can be omitted), {z} — zoom level, {x} and {y} — tile coordinates.
         * 
         * You can use custom keys in the template, which will be evaluated from {@link Ext.ux.LeafletMap#tileLayerOptions}, like this:
         * 
         *     tileLayerUrl: 'http://{s}.somedomain.com/{foo}/{z}/{x}/{y}.png', tileLayerOptions: {foo: 'bar'};
         * 
         * @accessor
         */
        tileLayerUrl: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',

        /**
         * @cfg {Object} tileLayerOptions
         * Tile-layer options which should be used in the L.TileLayer constructor.
         * @accessor
         */
        tileLayerOptions: {},

        /**
         * @cfg {L.TileLayer} tileLayer
         * The wrapped layer.
         * @accessor
         */
        tileLayer: null,

        /**
         * @cfg {Ext.util.Geolocation} geo
         * Geolocation provider for the map.
         * @accessor
         */
        geo: null,

        /**
         * @cfg {Boolean} autoMapCenter
         * Defines if the map should automatically center itself on a geoupdate event.
         * Only applies if {@link Ext.ux.LeafletMap#useCurrentLocation} is set to true.
         * @accessor
         */
        autoMapCenter: false,

        /**
         * @cfg {Boolean} initialCenter
         * Defines if the map initially should be centered to the current location.
         * @accessor
         */
        initialCenter: true
    },

    constructor: function () {
        this.callParent(arguments);

        var ll = window.L;

        if (!ll) {
            this.setHtml('Leaflet library is required');
        }
    },

    initialize: function () {
        this.callParent();
        this.on({
            painted: 'doResize',
            scope: this
        });
        this.innerElement.on('touchstart', 'onTouchStart', this);
    },

    getElementConfig: function () {
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

    onTouchStart: function (e) {
        e.makeUnpreventable();
    },

    applyMapOptions: function (options) {
        return Ext.merge({}, this.options, options);
    },

    updateMapOptions: function (newOptions) {
        var me = this,
            ll = window.L,
            map = this.getMap();

        if (ll && map) {
            map.setOptions(newOptions);
        }
        if (newOptions.center && !me.isPainted()) {
            me.un('painted', 'setMapCenter', this);
            me.on('painted', 'setMapCenter', this, { delay: 150, single: true, args: [newOptions.center] });
        }
    },

    getMapOptions: function () {
        return Ext.merge({}, this.options || this.getInitialConfig('mapOptions'));
    },

    getTileLayerOptions: function () {
        return Ext.merge({}, this.options || this.getInitialConfig('tileLayerOptions'));
    },

    updateUseCurrentLocation: function (useCurrentLocation) {
        this.setGeo(useCurrentLocation);
        if (!this.getMap() && (!useCurrentLocation || !this.getInitialCenter())) {
            this.renderMap();
        }
    },

    applyGeo: function (config) {
        return Ext.factory(config, Ext.util.Geolocation, this.getGeo());
    },

    updateGeo: function (newGeo, oldGeo) {
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

    doResize: function () {
        var ll = window.L,
            map = this.getMap();

        if (ll && map) {
            map.invalidateSize();
        }
    },

    // @private
    renderMap: function () {
        var me = this,
            ll = window.L,
            element = me.mapContainer,
            mapOptions = me.getMapOptions(),
            map,
            tileLayer;

        // if map isn't painted yet -> recall method after a certain time
        if (!me.isPainted()) {
            me.un('painted', 'renderMap', this);
            me.on('painted', 'renderMap', this, { delay: 150, single: true, args: [] });
            return;
        }

        if (ll) {
            if (element.dom.firstChild) {
                Ext.fly(element.dom.firstChild).destroy();
            }

            // if no center property is given -> use default position
            if (!mapOptions.hasOwnProperty('center') || !(mapOptions.center instanceof ll.LatLng)) {
                mapOptions.center = new ll.LatLng(47.36865, 8.539183); // default: Zuerich
            }

            me.setTileLayer(new ll.TileLayer(me.getTileLayerUrl(), me.getTileLayerOptions()));
            tileLayer = me.getTileLayer();
            mapOptions.layers = [tileLayer];

            me.setMap(new ll.Map(element.dom, mapOptions));
            map = me.getMap();

            // track map events
            map.on('zoomend', me.onZoomEnd, me);
            map.on('movestart', me.onMoveStart, me);
            map.on('moveend', me.onMoveEnd, me);
            me.fireEvent('maprender', me, map, tileLayer);
        }
    },

    // @private
    onGeoUpdate: function (geo) {
        var ll = window.L;

        if (ll && geo && (this.getAutoMapCenter() || this.getInitialCenter())) {
            this.setMapCenter(new ll.LatLng(geo.getLatitude(), geo.getLongitude()));
            this.setInitialCenter(false);
        }
    },

    // @private
    onGeoError: function (geo) {
        this.setUseCurrentLocation(false);
        if(!this.getMap()) {
            this.renderMap();
        }
    },

    /**
     * Moves the map center to the designated coordinates hash of the form:
     *
     *     { latitude: 47.36865, longitude: 8.539183 }
     *
     * or a L.LatLng object representing to the target location.
     *
     * @param {Object/L.LatLng} coordinates Object representing the desired longitude and
     * latitude upon which to center the map.
     */
    setMapCenter: function (coordinates) {
        var me = this,
            map = me.getMap(),
            ll = window.L;

        if (ll) {
            if (!me.isPainted()) {
                me.un('painted', 'setMapCenter', this);
                me.on('painted', 'setMapCenter', this, { delay: 150, single: true, args: [coordinates] });
                return;
            }

            coordinates = coordinates || new ll.LatLng(47.36865, 8.539183);

            if (coordinates && !(coordinates instanceof ll.LatLng) && coordinates.hasOwnProperty('latitude')) {
                coordinates = new ll.LatLng(coordinates.latitude, coordinates.longitude);
            }

            if (!map) {
                me.renderMap();
                map = me.getMap();
            }

            if (map && coordinates instanceof ll.LatLng) {
                map.panTo(coordinates);
            } else {
                this.options = Ext.apply(this.getMapOptions(), {
                    center: coordinates
                });
            }
        }
    },

    // @private
    onZoomEnd: function () {
        var mapOptions = this.getMapOptions(),
            map = this.getMap(),
            tileLayer = this.getTileLayer(),
            zoom;

        zoom = map.getZoom() || 10;

        this.options = Ext.apply(mapOptions, {
            zoom: zoom
        });

        this.fireEvent('zoomend', this, map, tileLayer, zoom);
    },

    // @private
    onMoveStart: function () {
        var map = this.getMap(),
            tileLayer = this.getTileLayer();

        this.fireEvent('movestart', this, map, tileLayer);
    },

    // @private
    onMoveEnd: function () {
        var map = this.getMap(),
            tileLayer = this.getTileLayer();

        this.fireEvent('moveend', this, map, tileLayer);
    },

    // @private
    destroy: function () {
        Ext.destroy(this.getGeo());
        var map = this.getMap();

        if (map) {
            map.destroy();
        }

        this.callParent();
    }
});
/**
 * Wraps a Leaflet map in an {@link Ext.Component} using the [Leaflet API](http://leafletjs.com/reference.html).
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
        initialCenter: true,

        /**
         * @cfg {Boolean} enableOwnPositionMarker
         * Defines if a marker should be placed on the current position.
         * This marker automatically updates its position on a location update event.
         * Only works if useCurrentLocation is set to true.
         * @accessor
         */
        enableOwnPositionMarker: false,

        /**
         * @cfg {L.Marker} ownPositionMarker
         * Marker object which shows the current location.
         * @accessor
         */
        ownPositionMarker: null,

        /**
         * @cfg {Object} ownPositionMarkerIcon
         * Options for the icon of own position marker.
         * See [L.Icon](http://leafletjs.com/reference.html#icon) documentation for possible options.
         * @accessor
         */
        ownPositionMarkerIcon: {
            iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo5MzU1NTA1QkVCOEJFMTExOURCNTg1MjVEMTZGRkZFNSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo4QjhBOThCNjhCRUMxMUUxQjI0RUVFOTMxQkJCQjcxQyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4QjhBOThCNThCRUMxMUUxQjI0RUVFOTMxQkJCQjcxQyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1LjEgV2luZG93cyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjkzNTU1MDVCRUI4QkUxMTE5REI1ODUyNUQxNkZGRkU1IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjkzNTU1MDVCRUI4QkUxMTE5REI1ODUyNUQxNkZGRkU1Ii8+IDwvcmRmOkRlc2NyaXB0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',
            iconSize: [20, 20],
            iconAnchor: [20/2, 20/2]
        },

        /**
         * @cfg {Object} ownPositionMarkerOptions
         * Own position marker options.
         * See [L.Marker](http://leafletjs.com/reference.html#marker) documentation for possible options.
         * @accessor
         */
        ownPositionMarkerOptions: {
            clickable: false
        }
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

            // add own position marker if enabled
            if(me.getGeo() && me.getEnableOwnPositionMarker()) {
                me.addOwnPositionMarker();
            }

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

    /**
     * @private
     * Adds own position marker to map
     */
    addOwnPositionMarker: function() {
        var me = this,
            icon,
            iconOptions,
            ownPositionMarker,
            markerOptions;

        iconOptions = Ext.merge({}, me.getOwnPositionMarkerIcon());
        icon = L.icon(iconOptions);

        markerOptions = Ext.merge({ icon: icon }, me.getOwnPositionMarkerOptions());
        ownPositionMarker = L.marker([me.getGeo().getLatitude(), me.getGeo().getLongitude()], markerOptions);
        me.setOwnPositionMarker(ownPositionMarker);
        ownPositionMarker.addTo(me.getMap());

        // add listener for locationupdate event of geolocation for setting marker position
        me.getGeo().addListener('locationupdate', function() {
            // this referes to the geolocation
            me.setOwnPositionMarkerPosition(L.latLng(this.getLatitude(), this.getLongitude()));
        });
    },

    /**
     * @private
     * Sets position of own position marker
     * @param {L.LatLng} latlng New position of marker
     */
    setOwnPositionMarkerPosition: function(latlng) {
        var ownPositionMarker = this.getOwnPositionMarker();
        if(ownPositionMarker) {
            ownPositionMarker.setLatLng(latlng);
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
        var map = this.getMap(),
            layer = this.getTileLayer();

        if (map) {
            map = null;
        }
        if (layer) {
            layer = null;
        }

        this.callParent();
    }
});
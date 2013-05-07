/**
 * Abstract class MapAbstractType is extended by all Map{Type} classes.
 * Defines basic functionallity to plot markers on lafeletmap and handels iteraction with them.
 */
Ext.define('Kort.controller.MapAbstractType', {
    extend: 'Ext.app.Controller',
    config: {
        //must be overridden or set by derived class before this class gets initialized
        dataStore: null,
        //must be overridden or set by derived class before this class gets initialized
        dataStoreProxyURL: null,
        //must be overridden or set by derived class before this class gets initialized
        lLayerGroupName:null,

        refs: {
            mapNavigationView: '#mapNavigationView',
            //available after leafletmaprendered event
            lMapWrapper: '#leafletmapwrapper'
        },

        /**
         * @private
         */
        lLayerGroup: null,
        /**
         * @private
         */
        mapController:null,
        /**
         * @private
         */
        activeRecord: null,
        /**
         * @private
         */
        isSneakyPeakActivated: false
    },

    /**
     * @private
     */
    init: function() {
        var me = this;
        this.setLLayerGroup(L.layerGroup());
        me.setMapController(me.getApplication().getController('Map'));
        me.getApplication().on({
            leafletmaprendered: { fn: me._initData, scope:me },
            maptypeupdaterequest: { fn: me._onMapTypeUpdateRequest, scope: me }
        });
    },

    /**
     * Get the current gps coordinates.
     * @returns {L.latLng} latLng
     */
    getCurrentLocationLatLng: function() {
        return this.getMapController().getCurrentLocationLatLng();
    },

    /**
     * @private
     * Add layergroup to leaflet map and trigger update process to generate markers.
     * Called after leaflet map component is ready.
     */
    _initData: function() {
        var me = this;
        me.getMapNavigationView().on('sneakypeaktoggled', me._onSneakyPeakToggeled,me);
        //omit false moveend events right after the map has been created
        Ext.defer(function() {
            me.getLMapWrapper().on('moveend',me._onMapMoveEnd,me);
        },1000);
        me.getMapController().addLayerGroupToMap(me.getLLayerGroup(),me.getLLayerGroupName());
        me.updateDataStoreProxyUrl();
        me._updateData();
    },

    /**
     * @private
     * Abstract function; MUST be overidden by derived class.
     */
    onMarkerClickCallbackFunction: function() {},

    /**
     * @private
     * Abstract function; MUST be overidden by derived class.
     */
    updateDataStoreProxyUrl: function() {},

    /**
     * @private
     */
    _onMapMoveEnd: function() {
        if(this.getIsSneakyPeakActivated()) {
            this.updateDataStoreProxyUrl(true);
            this._updateData();
        }
    },

    /**
     * @private
     */
    _onMapTypeUpdateRequest: function() {
        this._updateData();
    },

    /**
     * @private
     * Generate markers from dataStore and add them to layergroup.
     */
    _updateData: function() {
        var me = this;
        if(me.getDataStore() && me.getLLayerGroup() && me.getDataStoreProxyURL()) {
            me.getDataStore().getProxy().setUrl(me.getDataStoreProxyURL());
            me.getDataStore().load({
                callback: function(records,operation,success) {
                    //ToDo should be implemented via Config.operationalRange
                    me.getDataStore().doOperationalRangeCheck(me.getLMapWrapper().getGeo(),5000);
                    me.getLLayerGroup().clearLayers();
                    records.forEach(function(record) {
                        me.getLLayerGroup().addLayer(me._createLMarkerFromRecord(record));
                    });
                }
            });
        }
    },

    /**
     * @private
     * Function called every time a marker has been klicked, delegates klick to markerClickCallbackFunction defined in derived class.
     * @param {L.MouseEvent} e
     */
    _onMarkerClick: function(e) {
        var CLICK_TOLERANCE = 400,
            marker = e.target,
            timeDifference = e.originalEvent.timeStamp - marker.lastClickTimestamp;

        // LEAFLET BUGFIX: only execute click if there is a certain time between last click
        if(timeDifference > CLICK_TOLERANCE) {
            marker.lastClickTimestamp = e.originalEvent.timeStamp;
            this.setActiveRecord(marker.record);
            this.onMarkerClickCallbackFunction();
        }
    },

    /**
     * @private
     * @param record
     * @returns {L.marker} marker
     */
    _createLMarkerFromRecord: function(record) {
        var me = this,
            marker = L.marker([record.get('latitude'), record.get('longitude')], {
                icon: Kort.util.Config.getMarkerIcon(record.get('type'),record.get('state'),record.get('inOperationalRange'))
            });
        marker.record=record;
        marker.lastClickTimestamp = 0;
        marker.on('click', me._onMarkerClick,me);
        return marker;
    },

    /**
     * @private
     * @param state
     */
    _onSneakyPeakToggeled: function(state) {
        if(state) {
            this.setIsSneakyPeakActivated(true);
            this._onMapMoveEnd();
        }else {
            this.setIsSneakyPeakActivated(false);
            this.updateDataStoreProxyUrl(false);
            this._updateData();
        }
    }
});




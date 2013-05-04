/**
 * Abstract class MapAbstractType is extended by all Map{Type} classes
 * Defines basic functionallity to plot markers on lafeletmap and handels iteraction with them
 */
Ext.define('Kort.controller.MapAbstractType', {
    extend: 'Ext.app.Controller',
    config: {
        //must be set by derived class
        name:null,
        //must be set by derived class
        dataStore: null,
        //must be set by derived class
        dataStoreProxyURL: null,
        //must be set by derived class
        lLayerGroup: null,
        //must be set by derived class
        lLayerGroupName:null,

        mapController:null,
        activeRecord: null,

        refs: {
            mapNavigationView: '#mapNavigationView',
            //available after leafletmaprendered event
            lMapWrapper: '#leafletmapwrapper'
        },

        isSneakyPeakActivated: false
    },

    init: function() {
        var me = this;
        me.setMapController(me.getApplication().getController('Map'));
        me.getApplication().on({
            leafletmaprendered: { fn: me.initData, scope:me },
            maptypeupdaterequest: { fn: me._onMapTypeUpdateRequest, scope: me }
        });
    },

    /**
     * add layergroup (defined by derived class) to leaflet map and trigger, if automaticUpdate=true, update process to generate markers
     * called after leaflet map component is ready
     */
    initData: function() {
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
     *
     * abstract function; MUST be overidden by deriving class
     */
    onMarkerClickCallbackFunction: function() {},

    /**
     *
     * abstract function; MUST be overidden by deriving class
     */
    updateDataStoreProxyUrl: function() {},

    /**
     *
     * @private
     */
    _onMapMoveEnd: function() {
        if(this.getIsSneakyPeakActivated()) {
            this.updateDataStoreProxyUrl(true);
            this._updateData();
        }
    },

    /**
     *
     * @private
     */
    _onMapTypeUpdateRequest: function() {
        this._updateData();
    },

    /**
     *
     * @private
     * generate markers from dataStore and add them to layergroup
     */
    _updateData: function() {
        var me = this;
        if(me.getDataStore() && me.getLLayerGroup() && me.getDataStoreProxyURL()) {
            me.getDataStore().getProxy().setUrl(me.getDataStoreProxyURL());
            me.getDataStore().load({
                callback: function(records,operation,success) {
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
     *
     * @param {L.MouseEvent}e
     * @private
     * function called every time a marker has been klicked, delegates klick to markerClickCallbackFunction defined in derived class
     */
    _onMarkerClick: function(e) {
        var CLICK_TOLERANCE = 400;
        var marker = e.target;
        var timeDifference = e.originalEvent.timeStamp - marker.lastClickTimestamp;

        // LEAFLET BUGFIX: only execute click if there is a certain time between last click
        if(timeDifference > CLICK_TOLERANCE) {
            marker.lastClickTimestamp = e.originalEvent.timeStamp;
            this.setActiveRecord(marker.record);
            this.onMarkerClickCallbackFunction();
        }
    },

    /**
     *
     * @param record
     * @returns {L.marker} marker
     * @private
     */
    _createLMarkerFromRecord: function(record) {
        var me = this;
        var marker = L.marker([record.get('latitude'), record.get('longitude')], {
            icon: Kort.util.Config.getMarkerIcon(record.get('type'),record.get('state'),record.get('inOperationalRange'))
        });
        marker.record=record;
        marker.lastClickTimestamp = 0;
        marker.on('click', me._onMarkerClick,me);
        return marker;
    },

    /**
     *
     * @param state
     * @private
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
    },

    /**
     *
     * @returns {L.latLng} latLng
     */
    getCurrentLocationLatLng: function() {
        return this.getMapController().getCurrentLocationLatLng();
    }

});



/**
 *
 * Main controller for handle interaction with leaflet map.
 *
 */
Ext.define('Kort.controller.Map', {
    extend: 'Ext.app.Controller',
    config: {

        /**
         * @event maptypeupdaterequest
         * Fired on marker update request.
         */

        refs: {
            mapNavigationView: '#mapNavigationView',
            mapCenterButton: '#mapNavigationView .button[cls=mapCenterButton]',
            mapRefreshButton: '#mapNavigationView .button[cls=mapRefreshButton]',
            mapSneakyPeakSegmentedButton: '#mapNavigationView .segmentedbutton[cls=sneakyPeak]',
            mapLoadingIcon: '#mapNavigationView .button[cls=mapLoadingIcon]'
        },
        control: {
            mapNavigationView: {
                detailpush: '_onMapNavigationViewDetailViewPush',
                detailpop: '_onMapNavigationViewDetailViewBack',
                back: '_onMapNavigationViewDetailViewBack'
            },
            mapCenterButton: {
                tap: '_onMapNavigationViewCenterButtonTap'
            },
            mapRefreshButton: {
                tap: '_onMapNavigationViewRefreshButtonTap'
            },
            mapSneakyPeakSegmentedButton: {
                toggle: '_onSneakyPeakSegmentedButtonToggle'
            }

        },
        routes: {
            //direct link to geoposition on map startup
            //e.g. for london: http://local.play.kort.ch/#map/permalink?lat=51.503355&lng=-0.127564
            //in addition, a zoom level can be added (values between 0 and 18)
            //e.g. for london: http://local.play.kort.ch/#map/permalink?lat=51.503355&lng=-0.127564&z=15
            'map/:permalink': '_jumpToDifferentGeoLocation'
        },

        /**
         * @private
         * The leaflet map [L.Map](http://leafletjs.com/reference.html#map-class).
         */
        lMap: null,
        /**
         * @private
         * The {Kort.view.LeafletMap} component.
         */
        lMapWrapper: null,
        /**
         * @private
         * The leaflet layer control [L.Layer](http://leafletjs.com/reference.html#control)
         */
        lLayerControl: null,
        /**
         * @private
         */
        permalinkLLatLong:null,
        /**
         * @private
         */
        permalinkZoomLevel:null,
        /**
         * @private
         */
        mapMarkerTypeArray: [],
        /**
         * @private
         */
        isSneakyPeakActivated: false,
        /**
         * @private
         */
        sneakyPeakTimeout: null
    },

    /**
     * @private
     */
    init: function(){
        var me = this;
        me.getApplication().on({
            fixsend: {fn: me._triggerMapTypesUpdateProcess, scope:me },
            votesend: {fn: me._triggerMapTypesUpdateProcess, scope:me },
            geolocationready: { fn: me._createLeafletMapWrapper, scope: me }
        });

    },

    /**
     * Add a leaflet layer group to the leaflet map.
     * @param {L.LayerGroup} lLayerGroup
     * @param {String} lLayerGroupName
     */
    addLayerGroupToMap: function(lLayerGroup,lLayerGroupName) {
        this.getLLayerControl().addOverlay(lLayerGroup,lLayerGroupName);
        //there is no possibility to dynamically add a layer group to the leaflet map which is directly visible through default leaflet api.
        //Hack to circumvent this restriction: programmatically check all control checkboxes and call lefalet.control update function (same effect as if all the control checkboxes where clicked by hand).
        var inputNodeList = document.getElementsByClassName('leaflet-control-layers-selector'),
            i;
        for (i = 0; i<inputNodeList.length; i++) { inputNodeList[i].checked=true; }
        this.getLLayerControl()._onInputClick();//potentially dangerous call of leaflet private method. No other possibility yet discovered.
    },

    /**
     * Get the current gps coordiantes.
     * @returns {L.latLng}
     */
    getCurrentLocationLatLng: function() {
        var geo = this.getLMapWrapper().getGeo();
        return window.L.latLng(geo.getLatitude(), geo.getLongitude());
    },

    registerMapType: function(mapType) {
       this.getMapMarkerTypeArray().push(mapType);
    },


    /**
     * @private
     * Creates LeafletMap component. Is called right after the user's geolocation is available.
     * @param {Kort.util.Geolocation} geo
     */
    _createLeafletMapWrapper: function (geo) {
        this._enterLoadingState(false);
        var me = this,
            lMapWrapper = Ext.create('Kort.view.LeafletMap', {
                title: Ext.i18n.Bundle.message('map.title'),
                useCurrentLocation: geo,
                initialCenter: false,
                id: 'leafletmapwrapper'
            });
        lMapWrapper.on('maprender', me._onLMapRendered,me);
        //omit false movestart and moveend events right after the map has been created
        Ext.defer(function() {
            lMapWrapper.on('movestart',me._onMapMoveStart,me);
            lMapWrapper.on('moveend',me._onMapMoveEnd,me);
        },1000);
        me.setLMapWrapper(lMapWrapper);
        me.getMapNavigationView().add(lMapWrapper);
        me.getMapNavigationView().on('sneakypeaktoggled', me._onSneakyPeakToggeled,me);
        //if there is a JumpPosition set through route query, use this one as starting center position.
        if(me.getPermalinkLLatLong()) {
            me._centerMapToPermalinkPosition();
            if(me.getPermalinkZoomLevel()) {
                me._zoomMapToPermalinkZoomLevel();
            }
        }else {
            me._centerMapToCurrentPosition();
        }

    },

    /**
     * @private
     * Sets the coordinates and zoomlevel, to which the center of the map should jump after being successfully initialized.
     * Called by routes with permalink Object containing the optional keys:
     * lat = latitude
     * lng = longitude
     * z = zoom level (0 - 18)
     * @param {Object} permalink
     */
    _jumpToDifferentGeoLocation: function(permalink) {
        if(permalink.lat && permalink.lng) {
            this.setPermalinkLLatLong(L.latLng(permalink.lat,permalink.lng));
            if(permalink.z && permalink.z>=0 && permalink.z <=18) {
                this.setPermalinkZoomLevel(permalink.z);
            }
        }
    },

    /**
     * @private
     * @param {Kort.view.LeafletMap} cmp
     * @param {L.Map} map
     * @param {L.TileLayer} tileLayer
     */
    _onLMapRendered: function(cmp, map, tileLayer) {
        this.setLMap(map);
        var lLayerControl = new window.L.Control.Layers();
        lLayerControl.addTo(map);
        this.setLLayerControl(lLayerControl);
        this.getApplication().fireEvent('leafletmaprendered');
    },

    /**
     * @private
     * @param {Ext.SegmentedButton} segmentedButton
     * @param {Ext.Button} button
     * @param {Boolean} isPressed
     * @param {Object} eOpts
     */
    _onSneakyPeakSegmentedButtonToggle: function(segmentedButton, button, isPressed, eOpts) {
        this.setIsSneakyPeakActivated(isPressed);
        this._triggerMapTypesUpdateProcess();
    },

    /**
     * @private
     * Called when a leaflet map [moveend event](http://leafletjs.com/reference.html#map-events) was detected.
     */
    _onMapMoveEnd: function() {
        var me = this;
        if(me.getIsSneakyPeakActivated()) {
            //prevent exhausting ajax calls when user scrolls heavily on map: User has to stay "calm" on one
            // point for 2 seconds to trigger the sneaky peak update call.
            me.setSneakyPeakTimeout(setTimeout(function(){me._triggerMapTypesUpdateProcess(me);},2000));
        }
    },

    /**
     * @private
     * Called when a leaflet map [movestart event](http://leafletjs.com/reference.html#map-events) was detected.
     */
    _onMapMoveStart: function() {
        if(this.getSneakyPeakTimeout()) {
            window.clearTimeout(this.getSneakyPeakTimeout());
        }
    },

    /**
     *
     * @private
     * @param context This function is sometimes called via javascript timeout. In that case, the correct "this context"
     * is passed via parameter.
     */
    _triggerMapTypesUpdateProcess: function(context) {
        var me = this;
        //change context according to parameter. Exclude sencha internal context call.
        if(typeof(context)!=='undefined' && typeof(context.fn)==='undefined') {me=context;}
        me.getApplication().fireEvent('maptypeupdaterequest',me.getIsSneakyPeakActivated());
        me._enterLoadingState(true);
    },

    /**
     * @private
     * @param {boolean} silentLoading Indicates whether a blocking loading message should be overlaid or not.
     * @param {boolean} recursiveCall Private param that should always be false when called from outside.
     */
    _enterLoadingState: function(silentLoading,recursiveCall) {
        if(!recursiveCall) {
            this._showLoadMask(silentLoading);
        }
        if(this._checkIfAllMapTypesAreLoaded()) {
            this._hideLoadMask(silentLoading);
        }else {
            Ext.defer(this._enterLoadingState,200,this,[silentLoading,true]);
        }
    },

    /**
     * @private
     * @returns {boolean} True if all MapTypes are successfulyy loaded to map.
     */
    _checkIfAllMapTypesAreLoaded: function() {
        var toReturn = true;
        this.getMapMarkerTypeArray().forEach(function(element, index, array) {
            if(element.isLoaded()===false) {toReturn=false;}
        });
        return toReturn;
    },

    /**
     * @private
     */
    _showLoadMask: function(silentLoading) {
        this.getMapSneakyPeakSegmentedButton().disable();
        this.getMapCenterButton().disable();
        this.getMapRefreshButton().hide();
        this.getMapLoadingIcon().show();
        if(!silentLoading) {
            this.getMapNavigationView().setMasked({
                xtype: 'loadmask',
                message: Ext.i18n.Bundle.message('map.loadmask.message'),
                zIndex: Kort.util.Config.getZIndex().overlayLeafletMap
            });
        }
    },

    /**
     * @private
     */
    _hideLoadMask: function(silentLoading) {
        this.getMapLoadingIcon().hide();
        this.getMapSneakyPeakSegmentedButton().enable();
        this.getMapCenterButton().enable();
        this.getMapRefreshButton().show();
        if(!silentLoading) {this.getMapNavigationView().setMasked(false);}
    },


    /**
     * @private
     * @param {Kort.view.map.NavigationView} cmp
     * @param {Mixed} view
     * @param {Object} opts
     */
    _onMapNavigationViewDetailViewPush: function(cmp, view, opts) {
        this.getMapCenterButton().hide();
        this.getMapRefreshButton().hide();
        this.getMapSneakyPeakSegmentedButton().hide();
    },

    /**
     * @private
     * @param {Kort.view.map.NavigationView} cmp
     * @param {Mixed} view
     * @param {Object} opts
     */
    _onMapNavigationViewDetailViewBack: function(cmp, view, opts) {
        this.getMapCenterButton().show();
        this.getMapRefreshButton().show();
        this.getMapSneakyPeakSegmentedButton().show();
    },

    /**
     * @private
     */
    _onMapNavigationViewCenterButtonTap: function () {
        this._centerMapToCurrentPosition();
    },

    /**
     * @private
     */
    _onMapNavigationViewRefreshButtonTap: function () {
        this._triggerMapTypesUpdateProcess();
    },

    /**
     * @private
     */
    _centerMapToCurrentPosition: function() {
        this.getLMapWrapper().setMapCenter(this.getCurrentLocationLatLng());
    },

    /**
     * @private
     */
    _centerMapToPermalinkPosition: function() {
        this.getLMapWrapper().setMapCenter(this.getPermalinkLLatLong());
    },

    /**
     * @private
     */
    _zoomMapToPermalinkZoomLevel: function() {
        this.getLMapWrapper().setMapZoomLevel(this.getPermalinkZoomLevel());
    }

});

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
            mapSneakyPeakSegmentedButton: '#mapNavigationView .segmentedbutton[cls=sneakyPeak]'
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
         */
        lMap: null,
        /**
         * @private
         */
        lMapWrapper: null,
        /**
         * @private
         */
        lLayerControl: null,
        /**
         * @private
         */
        jumpLLatLong:null,
        /**
         * @private
         */
        jumpZoomLevel:null,

        mapTypeLoaded:[]
    },

    /**
     * @private
     */
    init: function(){
        var me = this;
        me.callParent(arguments);
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
        return L.latLng(geo.getLatitude(), geo.getLongitude());
    },

    registerMapType: function(name) {
        this.setMapTypeLoaded(this.getMapTypeLoaded()[name]=false);
    },

    markMapTypeAsLoaded: function(name) {
        this.setMapTypeLoaded(this.getMapTypeLoaded()[name]=true);
    },

    /**
     * @private
     * Creates LeafletMap component.
     * @param {Kort.util.Geolocation} geo
     */
    _createLeafletMapWrapper: function (geo) {
        var me = this,
            lMapWrapper = Ext.create('Kort.view.LeafletMap', {
                title: Ext.i18n.Bundle.message('map.title'),
                useCurrentLocation: geo,
                initialCenter: false,
                id: 'leafletmapwrapper'
            });
        lMapWrapper.on('maprender', me._onLMapRendered,me);
        me.setLMapWrapper(lMapWrapper);
        me.getMapNavigationView().add(lMapWrapper);
        //if there is a JumpPosition set through route query, use this one as starting center position.
        if(me.getJumpLLatLong()) {
            me._centerMapToJumpPosition();
            if(me.getJumpZoomLevel()) {
                me._zoomMapToJumpZoomLevel();
            }
        }else {
            me._centerMapToCurrentPosition();
        }
        this._enterLoadingState(true);
    },

    /**
     * @private
     * Sets the coordinates and zoomlevel, to which the center of the map should jump after being successfully initialized.
     * Called by routes with locationToJump Object containing the optional keys:
     * lat = latitude
     * lng = longitude
     * z = zoom level (0 - 18)
     * @param {Object} locationToJump
     */
    _jumpToDifferentGeoLocation: function(locationToJump) {

        if(locationToJump.lat && locationToJump.lng) {
            this.setJumpLLatLong(L.latLng(locationToJump.lat,locationToJump.lng));
            if(locationToJump.z && locationToJump.z>=0 && locationToJump.z <=18) {
                this.setJumpZoomLevel(locationToJump.z);
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
        var lLayerControl = new L.Control.Layers();
        lLayerControl.addTo(map);
        this.setLLayerControl(lLayerControl);
        this.getApplication().fireEvent('leafletmaprendered');
    },

    /**
     * @private
     */
    _triggerMapTypesUpdateProcess: function() {
        this.getApplication().fireEvent('maptypeupdaterequest');
    },

    /**
     * @private
     * @param {boolean} overlayMask
     * @param {boolean} recursiveCall
     */
    _enterLoadingState: function(overlayMask,recursiveCall) {
        if(overlayMask && !recursiveCall) {this._showLoadMask();}
        if(this._checkIfAllMapTypesAreLoaded()) {
            this._clearLoadingState(overlayMask);
        }else {
            Ext.defer(this._enterLoadingState,200,this,[overlayMask,true]);
        }
    },

    /**
     * @private
     * @param overlayMask
     */
    _clearLoadingState: function(overlayMask) {
        //if(overlayMask) {this._hideLoadMask();}
    },

    /**
     * @private
     * @returns {boolean}
     */
    _checkIfAllMapTypesAreLoaded: function() {
        var toReturn = true;
        Ext.Array.each(this.getMapTypeLoaded(), function(recordIsLoaded){
            if(!recordIsLoaded) {toReturn=false;}
        });
        return toReturn;
    },

    /**
     * @private
     */
    _showLoadMask: function() {
        this.getMapCenterButton().disable();
        this.getMapRefreshButton().disable();
        this.getMapSneakyPeakSegmentedButton().disable();
        this.getMapNavigationView().push({
            xtype: 'loadmask',
            message: 'loading',
            zIndex: Kort.util.Config.getZIndex().overlayLeafletMap
        });
    },

    /**
     * @private
     */
    _hideLoadMask: function() {
        this.getMapNavigationView().setMasked(false);
        this.getMapCenterButton().enable();
        this.getMapRefreshButton().enable();
        this.getMapSneakyPeakSegmentedButton().enable();
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
    _centerMapToJumpPosition: function() {
        this.getLMapWrapper().setMapCenter(this.getJumpLLatLong());
    },

    /**
     * @private
     */
    _zoomMapToJumpZoomLevel: function() {
        this.getLMapWrapper().setMapZoomLevel(this.getJumpZoomLevel());
    },

    /**
     * @private
     * @param {Ext.SegmentedButton} segmentedButton
     * @param {Ext.Button} button
     * @param {Boolean} isPressed
     * @param {Object} eOpts
     */
    _onSneakyPeakSegmentedButtonToggle: function(segmentedButton, button, isPressed, eOpts) {
        this.getMapNavigationView().fireEvent('sneakypeaktoggled',isPressed);
    }

});

/**
 *
 * Main controller for handle interaction with leaflet map
 *
 */
Ext.define('Kort.controller.Map', {
    extend: 'Ext.app.Controller',
    config: {
        /**
         * @event leafletmaprendered
         * Fired when tile leaflet map is rendered.
         */

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
        lMap: null,
        lMapWrapper: null,
        lLayerControl: null,
        jumpLLatLong:null,
        jumpZoomLevel:null
    },

    /**
     *
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
     *
     * @param {L.LayerGroup} lLayerGroup
     * @param {String} lLayerGroupName
     *
     * add a layer group to the map at runtime
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
     *
     * @returns {L.latLng}
     *
     * get the current gps coordiantes
     */
    getCurrentLocationLatLng: function() {
        var geo = this.getLMapWrapper().getGeo();
        return L.latLng(geo.getLatitude(), geo.getLongitude());
    },

    /**
     *
     * @param {Kort.util.Geolocation} geo
     * @private
     *
     * creates LeafletMap component
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
    },

    /**
     *
     * @param locationToJump
     * @private
     * sets the coordinates and zoomlevel, to which the center of the map should jump after being successfully initialized
     * called by routes with locationToJump Object containing the optional keys:
     * lat = latitude
     * lng = longitude
     * z = zoom level (0 - 18)
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
     *
     * @param {Kort.view.LeafletMap} cmp
     * @param {L.Map} map
     * @param {TileLayer} tileLayer
     * @private
     */
    _onLMapRendered: function(cmp, map, tileLayer) {
        this.setLMap(map);
        var lLayerControl = new L.Control.Layers();
        lLayerControl.addTo(map);
        this.setLLayerControl(lLayerControl);
        this.getApplication().fireEvent('leafletmaprendered');
    },

    /**
     *
     * @private
     */
    _triggerMapTypesUpdateProcess: function() {
        this.getApplication().fireEvent('maptypeupdaterequest');
    },

    //ToDo set param types
    /**
     *
     * @param cmp
     * @param view
     * @param opts
     * @private
     */
    _onMapNavigationViewDetailViewPush: function(cmp, view, opts) {
        var me = this;
        me.getMapCenterButton().hide();
        me.getMapRefreshButton().hide();
    },

    //ToDo set param types
    /**
     *
     * @param cmp
     * @param view
     * @param opts
     * @private
     */
    _onMapNavigationViewDetailViewBack: function(cmp, view, opts) {
        this.getMapCenterButton().show();
        this.getMapRefreshButton().show();
    },

    /**
     *
     * @private
     */
    _onMapNavigationViewCenterButtonTap: function () {
        this._centerMapToCurrentPosition();
    },

    /**
     *
     * @private
     */
    _onMapNavigationViewRefreshButtonTap: function () {
        this._triggerMapTypesUpdateProcess();
    },

    /**
     *
     * @private
     */
    _centerMapToCurrentPosition: function() {
        this.getLMapWrapper().setMapCenter(this.getCurrentLocationLatLng());
    },

    /**
     *
     * @private
     */
    _centerMapToJumpPosition: function() {
        this.getLMapWrapper().setMapCenter(this.getJumpLLatLong());
    },

    /**
     *
     * @private
     */
    _zoomMapToJumpZoomLevel: function() {
        this.getLMapWrapper().setMapZoomLevel(this.getJumpZoomLevel());
    },

    /**
     *
     * @param {Ext.SegmentedButton} segmentedButton
     * @param {Ext.Button} button
     * @param {Boolean} isPressed
     * @param eOpts
     * @private
     */
    _onSneakyPeakSegmentedButtonToggle: function(segmentedButton, button, isPressed, eOpts) {
        this.getMapNavigationView().fireEvent('sneakypeaktoggled',isPressed);
    }

});

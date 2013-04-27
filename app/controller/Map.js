/**
 * Controller for leaflet map
 */
Ext.define('Kort.controller.Map', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            mapNavigationView: '#mapNavigationView',
            mapCenterButton: '#mapNavigationView .button[cls=mapCenterButton]',
            mapRefreshButton: '#mapNavigationView .button[cls=mapRefreshButton]'
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
            }
        },
        routes: {
            //direct link to geoposition on map startup
            //e.g. for london: http://local.play.kort.ch/#map/jump?lat=51.503355&lng=-0.127564
            //in addition, a zoom level can be added (values between 0 and 18)
            //e.g. for london: http://local.play.kort.ch/#map/jump?lat=51.503355&lng=-0.127564&z=1
            'map/:jump': '_jumpToDifferentGeoLocation'
        },
        lMap: null,
        lMapWrapper: null,
        lLayerControl: null,
        jumpLLatLong:null,
        jumpZoomLevel:null

    },

    init: function(){
        var me = this;
        me.callParent(arguments);
        me.getApplication().on({
            fixsend: {fn: me._triggerMapTypesUpdateProcess, scope:me },
            votesend: {fn: me._triggerMapTypesUpdateProcess, scope:me },
            geolocationready: { fn: me.createLeafletMapWrapper, scope: me }
        });
    },

    /**
     *invoked by gelocationready event fired by app.js after geolocation data is available
     */
    createLeafletMapWrapper: function (geo) {
        var me = this;
        var lMapWrapper = Ext.create('Kort.view.LeafletMap', {
            title: Ext.i18n.Bundle.message('map.title'),
            useCurrentLocation: geo,
            initialCenter: false,
            id: 'leafletmapwrapper'
        });
        lMapWrapper.on('maprender', function(cmp, map, tileLayer) {
            me.setLMap(map);
            var lLayerControl = new L.Control.Layers();
            lLayerControl.addTo(map);
            me.setLLayerControl(lLayerControl);
            me.getApplication().fireEvent('leafletmaprendered');
        });
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

    //adds {L.LayerGroup} lLayerGroup with display name lLayerGroupName as overlay to {L.Map} map
    addLayerGroupToMap: function(lLayerGroup,lLayerGroupName) {
        this.getLLayerControl().addOverlay(lLayerGroup,lLayerGroupName);
        //there is no possibility to dynamically add a layer group to the leaflet map which is directly visible through default leaflet api.
        //Hack to circumvent this restriction: programmatically check all control checkboxes and call lefalet.control update function (same effect as if all the control checkboxes where clicked by hand).
        var inputNodeList = document.getElementsByClassName('leaflet-control-layers-selector');
        for(var i = inputNodeList.length; i--; inputNodeList[i].checked=true);
        this.getLLayerControl()._onInputClick();
    },

    getCurrentLocationLatLng: function() {
        if(this.getLMapWrapper().getUseCurrentLocation()) {
            var geo = this.getLMapWrapper().getGeo();
            return L.latLng(geo.getLatitude(), geo.getLongitude());
        } else {
            console.log("controller/Map.js Line 62");
            return this.getLMapWrapper().getMap().getCenter();
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
     *
     */
    _jumpToDifferentGeoLocation: function(locationToJump) {

        if(locationToJump.lat && locationToJump.lng) {
            this.setJumpLLatLong(L.latLng(locationToJump.lat,locationToJump.lng));
            if(locationToJump.z && locationToJump.z>=0 && locationToJump.z <=18) {
                this.setJumpZoomLevel(locationToJump.z);
            }
        }
    },

    _triggerMapTypesUpdateProcess: function() {
        this.getApplication().fireEvent('maptypeupdaterequest');
    },

    _onMapNavigationViewDetailViewPush: function(cmp, view, opts) {
        var me = this;
        me.getMapCenterButton().hide();
        me.getMapRefreshButton().hide();
    },

    _onMapNavigationViewDetailViewBack: function(cmp, view, opts) {
        this.getMapCenterButton().show();
        this.getMapRefreshButton().show();
    },

    _onMapNavigationViewCenterButtonTap: function () {
        this._centerMapToCurrentPosition();
    },

    _onMapNavigationViewRefreshButtonTap: function () {
        this._triggerMapTypesUpdateProcess();
    },

    _centerMapToCurrentPosition: function() {
        this.getLMapWrapper().setMapCenter(this.getCurrentLocationLatLng());
    },

    _centerMapToJumpPosition: function() {
        this.getLMapWrapper().setMapCenter(this.getJumpLLatLong());
    },

    _zoomMapToJumpZoomLevel: function() {
        this.getLMapWrapper().setMapZoomLevel(this.getJumpZoomLevel());
    }

});

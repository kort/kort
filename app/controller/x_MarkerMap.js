/**
 * Controller for a map with markers on it
 */
Ext.define('Kort.controller.MarkerMap', {
    extend: 'Ext.app.Controller',
    requires: [
        'Ext.LoadMask',
        'Kort.view.markermap.bug.BugMessageBox',
        'Kort.view.markermap.bug.CampaignMessageBox',
        'Kort.view.markermap.bug.CampaignOverlay',
        'Kort.view.markermap.bug.fix.TabPanel',
        'Kort.view.markermap.validation.Container',
        'Kort.view.markermap.validation.ValidationMessageBox'
    ],

    config: {
        map: null,
        lLayerControl: null,
        bugMarkerLayerGroup: [],
        validationMarkerLayerGroup: [],
        bugInactiveMarkerLayerGroup: [],
        views: [

        ],
        refs: {
            leafletmapComponent: '#leafletmapcomponent',
            markermapNavigationView: '#markermapNavigationView',
            markermapCenterButton: '#markermapNavigationView .button[cls=markermapCenterButton]',
            markermapRefreshButton: '#markermapNavigationView .button[cls=markermapRefreshButton]'
        },
        control: {
            leafletmapComponent: {
                maprender: 'onMapRender'
            },
            markermapCenterButton: {
                tap: 'onMarkermapCenterButtonTap'
            },
            markermapRefreshButton: {
                tap: 'onMarkermapCenterButtonTap'
            },
            markermapNavigationView: {
                detailpush: 'onMarkerMapDetailViewPush',
                detailpop: 'onMarkerMapDetailViewBack',
                back: 'onMarkerMapDetailViewBack'
            }
        },
        markermapLeafletView: null,

        campaignsStore: null,
        bugsStore: null,
        validationsStore: null,
        bugsInactiveStore: null,

        activeRecord: null,

        detailPushDisabled: false,

        amountOfStoresSuccessfullyLoaded: 0,
        totalAmountOfStoresToLoad: 3,

        bugMessageBoxTemplate: null,

        campaignOverlayBackground: null
    },
    
    /**
     * @private
     * Initilizes the controller
     */
    init: function() {

        var me = this;

        me.callParent(arguments);

        me.getApplication().on({
            fixsend: { fn: me.loadStores, scope: me },
            votesend: { fn: me.loadStores, scope: me },
            geolocationready: { fn: me.geolocationReady, scope: me }
        });

        this.initStores();

        //register store loaded events - possibility for race condition failures - needs check
        this.getCampaignsStore().on('load',me.storeSuccessfullyLoaded , me);
        this.getBugsStore().on('load', me.storeSuccessfullyLoaded, me);
        this.getBugsInactiveStore().on('load', me.onInactiveBugsStoreUpdate, me);
        this.getValidationsStore().on('load', me.storeSuccessfullyLoaded, me);

        // create layer group for bug markers
        me.setBugMarkerLayerGroup(L.layerGroup());
        me.setValidationMarkerLayerGroup(L.layerGroup());
        me.setBugInactiveMarkerLayerGroup(L.layerGroup());

        //create campaignOverlay background div
        this.setCampaignOverlayBackground(Ext.create('Kort.view.markermap.bug.CampaignOverlay'));
    },

    /**
     * @private
     * Called when geolocation is ready to use.
     * Adds LeafletMap component to markermap view.
     */
    geolocationReady: function (geo) {
        var leafletmapComponent = Ext.create('Kort.view.LeafletMap', {
            title: Ext.i18n.Bundle.message('markermap.title'),
            useCurrentLocation: geo,
            id: 'leafletmapcomponent'
            //additionalLayers: [this.getBugMarkerLayerGroup(),this.getValidationMarkerLayerGroup(),this.getBugInactiveMarkerLayerGroup()]
        });
        //leafletmapComponent.addAdditionalLayer(this.getBugMarkerLayerGroup());
        //leafletmapComponent.addAdditionalLayer(this.getValidationMarkerLayerGroup());
        //leafletmapComponent.addAdditionalLayer(this.getBugInactiveMarkerLayerGroup());
        this.getMarkermapNavigationView().add(leafletmapComponent);
        this.loadStores();
    },


    // @private
    initStores: function() {
        this.setCampaignsStore(Ext.getStore('Campaigns'));
        this.setBugsStore(Ext.getStore('Bugs'));
        this.setBugsInactiveStore(Ext.getStore('BugsInactive'));
        this.setValidationsStore(Ext.getStore('Validations'))
    },

    // @private
    loadStores: function(showLoadMask) {
        var me = this;
        //relink campaignsstore with webservice
        //$$$ waiting for mwo

        //relink bugsstore to webservice
        var currentLatLng = me.getCurrentLocationLatLng(me.getLeafletmapComponent());
        me.getBugsStore().getProxy().setUrl(Kort.util.Config.getWebservices().bug.getUrl(currentLatLng.lat, currentLatLng.lng));

        //relinik validationstore to webservice
        me.getValidationsStore().getProxy().setUrl(Kort.util.Config.getWebservices().validation.getUrl(currentLatLng.lat, currentLatLng.lng));

        if (showLoadMask) {
            me.showLoadMask();
        }

        //load stores -
        me.getCampaignsStore().load();
        me.getBugsStore().load();
        me.getValidationsStore().load(function(records, operation, success) {
            me.getValidationsStore().updateDistances(Kort.geolocation);
        });
    },

    /**
     * @private
     * When MarkerMap starts up, there are different stores to load. If all stores have been
     * loaded successfully, the map should perform a reload. Every store has a registered load-Event
     * and whenever a store has loaded, this function is called and the loaded stores counter gets incremented.
     */

    storeSuccessfullyLoaded: function() {
        this.setAmountOfStoresSuccessfullyLoaded(this.getAmountOfStoresSuccessfullyLoaded()+1);
        if(this.getAmountOfStoresSuccessfullyLoaded()==this.getTotalAmountOfStoresToLoad()) {
            this.setAmountOfStoresSuccessfullyLoaded(0);
            this.refreshView();
        }
    },

    // @private
    onMarkerMapDetailViewPush: function(cmp, view, opts) {
        var me = this;
        me.getMarkermapCenterButton().hide();
        me.getMarkermapRefreshButton().hide();

        // reenable detail push after certain time
        Ext.defer(function() {
            me.setDetailPushDisabled(false);
        }, 2000);
    },

    // @private
    onMarkerMapDetailViewBack: function(cmp, view, opts) {
        this.getMarkermapCenterButton().show();
        this.getMarkermapRefreshButton().show();
    },

    // @private
    onMarkermapCenterButtonTap: function () {
        this.centerMapToCurrentPosition();
    },

    // @private
    onMarkermapCenterButtonTap: function () {
        this.centerMapToCurrentPosition();
        this.loadStores(true);
    },

    /*********************************************************
     * BEGIN
     * Leaflet-Map related functions
     *
     *********************************************************/

    /*
     * @private
     *
     * Reloads and redraws all markers
     */
    refreshView: function () {
        this.removeAllMarkers();
        //redraw bug markers
        this.redrawMarkers(this.getBugsStore().getData().all, 'bug');
        //redraw validation markers
        this.redrawMarkers(this.getValidationsStore().getData().all,'validation');

        this.hideLoadMask();
    },

    onInactiveBugsStoreUpdate: function() {
        this.getBugsInactiveStore().remove(this.getBugsStore().getData().all);
        this.redrawMarkers(this.getBugsInactiveStore().getData().all,'buginactive');
    },


    /**
     * @private
     * Shows load mask
     */
    showLoadMask: function () {
        this.getMarkermapCenterButton().disable();
        this.getMarkermapRefreshButton().disable();
        this.getMarkermapNavigationView().setMasked({
            xtype: 'loadmask',
            message: Ext.i18n.Bundle.message('markermap.loadmask.message'),
            zIndex: Kort.util.Config.getZIndex().overlayLeafletMap
        });
    },

    /**
     * @private
     * Hides load mask
     */
    hideLoadMask: function() {
        this.getMarkermapNavigationView().setMasked(false);
        this.getMarkermapCenterButton().enable();
        this.getMarkermapRefreshButton().enable();
    },

    // @private
    onMapRender: function(cmp, map, tileLayer) {
        var me = this;
        me.setMap(map);
        //var baseMap = {};
        //var additionalMap;
        var validationLayerTitle = Ext.i18n.Bundle.message('validation.title');
        /*
        additionalMap = {
            'markermap.bug.layername': this.getBugMarkerLayerGroup(),
            'markermap.validation.layername': this.getValidationMarkerLayerGroup()
            //'markermap.bugInactive.layername': this.getBugInactiveMarkerLayerGroup()
        };
        var control = L.control.i18nLayers(baseMap,additionalMap);
        */
        var control = new L.Control.Layers({},{},{collapsed:false});
        control.addTo(map);
        control.addOverlay(this.getBugMarkerLayerGroup(),Ext.i18n.Bundle.message('markermap.bug.layername'));
        control.addOverlay(this.getValidationMarkerLayerGroup(),Ext.i18n.Bundle.message('markermap.validation.layername'));
        //var nl = document.getElementsByClassName('leaflet-control-layers-selector');
        //var test = [];

        var inputNodeList = document.getElementsByClassName('leaflet-control-layers-selector');
        for(var i = inputNodeList.length; i--; inputNodeList[i].checked=true);

        /*
        Array.prototype.slice.call(document.getElementsByClassName('leaflet-control-layers-selector')).forEach(function(item) {
            console.log(item);
        });
        */
        /*
        document.getElementsByClassName('leaflet-control-layers-selector')[0].checked=true;
        document.getElementsByClassName('leaflet-control-layers-selector')[1].checked=true;
        */

        control._onInputClick();

        /*
        var additionalMap2 = {
            'markermap.bug.layername': this.getBugMarkerLayerGroup()
            //'markermap.validation.layername': this.getValidationMarkerLayerGroup()
            //'markermap.bugInactive.layername': this.getBugInactiveMarkerLayerGroup()
        };
        */


        //L.control.i18nLayers(baseMap,additionalMap2).addTo(map);
    },

    onMapMoveEnd: function() {
        if(this.getLeafletmapComponent()) {
            var currentMapCenter = this.getLeafletmapComponent().getCurrentMapCenter();
            if(Math.round(Kort.geolocation.getDistance(currentMapCenter.lat, currentMapCenter.lng))>((Kort.util.Config.getWebservices().bug.radius/10)/2)) {
                this.getBugsInactiveStore().getProxy().setUrl(Kort.util.Config.getWebservices().bug.getUrl(currentMapCenter.lat, currentMapCenter.lng));
                this.getBugInactiveMarkerLayerGroup().clearLayers();
                this.getBugsInactiveStore().load();
                console.log(Kort.geolocation.getDistance(currentMapCenter.lat, currentMapCenter.lng));
            }
        }

        //Kort.geolocation
    },
    
    /**
     * @private
     * Centers map to current position
     */
    centerMapToCurrentPosition: function() {
        // centering map to current position
        this.getLeafletmapComponent().setMapCenter(this.getCurrentLocationLatLng(this.getLeafletmapComponent()));
    },

    /**
     * @private
     * Removes old and draws new markers
     * @param {Ext.data.Model[]} records Array of records from store
     * @param {String} sourceStore
     */
	redrawMarkers: function(records, source) {
        var me = this;

        // add markers
        Ext.each(records, function (record, index, length) {
            if(record.get('longitude') && record.get('longitude')) {
                me.addMarker(record,source);
            }
        });
	},
    
    /**
     * @private
     * Removes all markers from map
     */
    removeAllMarkers: function() {
        this.getBugMarkerLayerGroup().clearLayers();
        this.getValidationMarkerLayerGroup().clearLayers();
    },

    /**
     * @private
     * Adds marker for given record
     * @param {Ext.data.Model} record A record
     */
    addMarker: function(record,source) {
        var me = this,
            icon,
            marker;
        if(source=='buginactive') {
            record.set('state','inactive');
        }
        icon = Kort.util.Config.getMarkerIcon(record.get('type'),record.get('state'));
        marker = L.marker([record.get('latitude'), record.get('longitude')], {
            icon: icon
        });

        marker.source = source;
        marker.record = record;
        marker.lastClickTimestamp = 0;
        marker.on('click', me.onMarkerClick,me);
        if(source=='bug' || source=='buginactive') {
            me.getBugMarkerLayerGroup().addLayer(marker);
        }else if(source=='validation') {
            me.getValidationMarkerLayerGroup().addLayer(marker);
        }
    },

    /**
	 * @private
	 * Returns current location
     * @param {Ext.ux.LeafletMap} mapCmp LeafletMap component
	 */
	getCurrentLocationLatLng: function(mapCmp) {
		if(mapCmp.getUseCurrentLocation()) {
            var geo = mapCmp.getGeo();
			return L.latLng(geo.getLatitude(), geo.getLongitude());
		} else {
			return mapCmp.getMap().getCenter();
		}
	},

    /**
     * @private
     * Executed when marker gets clicked
     * @param {L.MouseEvent} e Mouse click event
     */
    onMarkerClick: function(e) {
        var marker = e.target,
            record = marker.record,
            CLICK_TOLERANCE = 400,
            timeDifference;

        timeDifference = e.originalEvent.timeStamp - marker.lastClickTimestamp;

        // LEAFLET BUGFIX: only execute click if there is a certain time between last click
        if(timeDifference > CLICK_TOLERANCE) {
            marker.lastClickTimestamp = e.originalEvent.timeStamp;
            this.setActiveRecord(record);
            if(marker.source=='bug') {
                this.onBugMarkerClicked();
            }else if(marker.source=='validation') {
                this.onValidationMarkerClicked();
            }
        }
    },

    /*********************************************************
     * BEGIN
     * Bug related functions
     *
     *********************************************************/

    /**
     * @private
     */
    onBugMarkerClicked: function() {
        //show BugMessageBox
        Ext.create('Kort.view.markermap.bug.BugMessageBox').confirm(this.getActiveRecord(), this.returnFromBugMessageBox, this);
        if(this.getActiveRecord().get('state')==Kort.util.Config.getMissionState().bugCampaign) {
            this.getLeafletmapComponent().add(this.getCampaignOverlayBackground());
        }
    },

    displayCampaignMessageBox: function () {
        Kort.view.markermap.bug.BugMessageBox.preventOpening=true;
        Ext.create('Kort.view.markermap.bug.CampaignMessageBox').confirm(this.getCampaignsStore().getById(this.getActiveRecord().get('campaign_id')), Ext.emptyFn, this, this.getActiveRecord().get('campaign_extra_coins'));
    },

    /**
     *
     * @param buttonId
     * @param value
     * @param opt
     * is called when user returns from BugMessageBox or Fix
     *
     */
    returnFromBugMessageBox: function(buttonId, value, opt) {
        if(this.getActiveRecord().get('state')==Kort.util.Config.getMissionState().bugCampaign) {
            this.getLeafletmapComponent().remove(this.getCampaignOverlayBackground(),false);
        }
        if (buttonId === 'yes') {
            this.showFix();
        }
        this.setActiveRecord(null);
    },

    /**
     * @private
     * Displays fix detail panel
     * @param {Kort.model.Bug} bug Bug instance
     */
    showFix: function () {
        var fixTabPanel = Ext.create('Kort.view.markermap.bug.fix.TabPanel', {
            record: this.getActiveRecord(),
            title: this.getActiveRecord().get('title')
        });
        this.getMarkermapNavigationView().push(fixTabPanel);
        this.getMarkermapNavigationView().fireEvent('detailpush', this.getMarkermapNavigationView());
    },


    /*********************************************************
     * BEGIN
     * Validation related functions
     *
     *********************************************************/

    /**
     * @private
     */
    onValidationMarkerClicked: function() {
        //show ValidationMessageBox
        Ext.create('Kort.view.markermap.validation.ValidationMessageBox').confirm(this.getActiveRecord(), this.returnFromValidationMessageBox, this);
    },

    returnFromValidationMessageBox: function(buttonId, value, opt){
        if (buttonId === 'yes'){
            this.showVote();
        }
        this.setActiveRecord(null);
    },

    /**
     * @private
     * Displays vote detail panel
     * @param {Kort.model.Vote} vote Vote instance
     */
    showVote: function() {

        if(!this.getDetailPushDisabled()) {
            // disable fast tapping
            this.setDetailPushDisabled(true);

            var voteContainer = Ext.create('Kort.view.markermap.validation.Container', {
                record: this.getActiveRecord(),
                title: this.getActiveRecord().get('title')
            });
            this.getMarkermapNavigationView().push(voteContainer);
            this.getMarkermapNavigationView().fireEvent('detailpush', this.getMarkermapNavigationView());
        }
    }
});
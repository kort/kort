/**
 * Controller for validation tab
 */
Ext.define('Kort.controller.Validation', {
    extend: 'Kort.controller.MarkerMap',
    requires: [
        'Ext.LoadMask'
    ],

    config: {
        views: [
            'validation.NavigationView',
            'validation.Container',
            'validation.List',
            'validation.vote.Container'
        ],
        refs: {
            mainTabPanel: '#mainTabPanel',
            validationNavigationView: '#validationNavigationView',
            validationContainer: '.validationcontainer',
            validationList: '.validationlist',
            mapCmp: '#validationmap',
            validationRefreshButton: '#validationNavigationView .button[cls=validationRefreshButton]',
            validationMapCenterButton: '#validationNavigationView .button[cls=validationMapCenterButton]',
            validationSegmentedbutton: '#validationNavigationView .segmentedbutton'
        },
        control: {
            mapCmp: {
                maprender: 'onMapRender'
            },
            validationList: {
                itemtap: 'onValidationListItemTap'
            },
            validationRefreshButton: {
                tap: 'onValidationRefreshButtonTap'
            },
            validationMapCenterButton: {
                tap: 'onValidationMapCenterButtonTap'
            },
            validationNavigationView: {
                detailpush: 'onValidationNavigationViewDetailPush',
                detailpop: 'onValidationNavigationViewBack',
                back: 'onValidationNavigationViewBack'
            },
            validationSegmentedbutton: {
                toggle: 'onValidationSegmentedbuttonToggle'
            }
        },

        detailPushDisabled: false,
        validationsStore: null,
        activeRecord: null
    },
    
    // @private
    init: function() {
        var me = this;
        me.callParent(arguments);

        me.setValidationsStore(Ext.getStore('Validations'));
        
        me.getApplication().on({
            votesend: { fn: me.loadStore, scope: me },
            geolocationready: { fn: me.geolocationReady, scope: me }
        });
        
        me.getValidationsStore().on('load', me.refreshView, me);
    },

    /**
     * @private
     * Called when geolocation is ready to use.
     * Adds LeafletMap component to validation view.
     */
    geolocationReady: function(geo) {
        var validationmap = {
            xtype: 'kortleafletmap',
            useCurrentLocation: geo,
            id: 'validationmap',
            hidden: true
        };
        this.getValidationContainer().add(validationmap);
        this.loadStore(true);
    },
    
    /**
     * @private
     * Loads validations store
     */
    loadStore: function(showLoadmask) {
        var me = this,
            mapCmp = me.getMapCmp(),
            validationsStore = me.getValidationsStore(),
            currentLatLng;

        currentLatLng = me.getCurrentLocationLatLng(mapCmp);
        validationsStore.getProxy().setUrl(Kort.util.Config.getWebservices().validation.getUrl(currentLatLng.lat, currentLatLng.lng));

        if(showLoadmask) {
            me.showLoadMask();
        }

        // Load validations store
		validationsStore.load(function(records, operation, success) {
            validationsStore.updateDistances(Kort.geolocation);
        });
    },

    /**
     * @private
     * Refreshes validations view
     */
    refreshView: function() {
        this.centerMapToCurrentPosition();
        this.redrawMarkers(this.getValidationsStore().getData().all);
        if(this.getValidationList()) {
            this.getValidationList().refresh();
        }
        this.hideLoadMask();
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
            this.showVote(record);
        }
    },
    
    /**
     * @private
     * Displays vote panel for given validation
     */
    onValidationListItemTap: function(list, index, target, record, e) {
        this.showVote(record);
    },

    /**
     * @private
     * Displays vote detail panel
     * @param {Kort.model.Vote} vote Vote instance
     */
    showVote: function(vote) {
        var me = this,
            validationNavigationView = me.getValidationNavigationView(),
            voteContainer;

        if(!me.getDetailPushDisabled()) {
            // disable fast tapping
            me.setDetailPushDisabled(true);
            
            voteContainer = Ext.create('Kort.view.validation.vote.Container', {
                record: vote,
                title: vote.get('title')
            });
            validationNavigationView.push(voteContainer);
            validationNavigationView.fireEvent('detailpush', validationNavigationView);
        }
    },

    /**
     * @private
     * Shows load mask
     */
    showLoadMask: function() {
        this.getValidationMapCenterButton().disable();
        this.getValidationRefreshButton().disable();
        this.getValidationSegmentedbutton().disable();
        this.getValidationNavigationView().setMasked({
            xtype: 'loadmask',
            message: Ext.i18n.Bundle.message('validation.loadmask.message'),
            zIndex: Kort.util.Config.getZIndex().overlayLeafletMap
        });
    },
    
    /**
     * @private
     * Hides load mask
     */
    hideLoadMask: function() {
        this.getValidationNavigationView().setMasked(false);
        this.getValidationMapCenterButton().enable();
        this.getValidationRefreshButton().enable();
        this.getValidationSegmentedbutton().enable();
    },

    // @private
    onValidationRefreshButtonTap: function() {
        this.loadStore(true);
    },

    // @private
    onValidationNavigationViewDetailPush: function(cmp, view, opts) {
        var me = this;

        me.getValidationRefreshButton().hide();
        me.getValidationSegmentedbutton().hide();
        me.getValidationMapCenterButton().hide();

        // reenable detail push after certain time
        Ext.defer(function() {
            me.setDetailPushDisabled(false);
        }, 2000);
    },
    
    // @private
    onValidationNavigationViewBack: function(cmp, view, opts) {
        this.getValidationRefreshButton().show();
        this.getValidationSegmentedbutton().show();
        if(this.getValidationContainer().getActiveItem() === this.getMapCmp()) {
            this.getValidationMapCenterButton().show();
        }
    },
    
    // @private
    onValidationMapCenterButtonTap: function() {
        this.centerMapToCurrentPosition();
    },
    
    // @private
    onValidationSegmentedbuttonToggle: function(cmp, button, isPressed) {
        if(button.getItemId() === 'map' && isPressed) {
            // show map view
            this.getValidationMapCenterButton().show();
            this.getValidationContainer().setActiveItem(this.getMapCmp());
        } else {
            this.getValidationMapCenterButton().hide();
            this.getValidationContainer().setActiveItem(this.getValidationList());
            this.getValidationList().refresh();
        }
    }
});
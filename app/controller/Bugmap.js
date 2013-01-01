/**
 * Controller for bugmap tab
 */
Ext.define('Kort.controller.Bugmap', {
    extend: 'Ext.app.Controller',
    requires: [
        'Ext.LoadMask'
    ],

    config: {
        views: [
            'bugmap.BugMessageBox',
            'bugmap.NavigationView',
            'bugmap.fix.TabPanel'
        ],
        refs: {
            mainTabPanel: '#mainTabPanel',
            mapCmp: '#bugmap',
            bugmapNavigationView: '#bugmapNavigationView',
            bugmapCenterButton: '#bugmapNavigationView .button[cls=bugmapCenterButton]',
            bugmapRefreshButton: '#bugmapNavigationView .button[cls=bugmapRefreshButton]'
        },
        control: {
            mapCmp: {
                maprender: 'onMapRender'
            },
            bugmapCenterButton: {
                tap: 'onBugmapCenterButtonTap'
            },
            bugmapRefreshButton: {
                tap: 'onBugmapRefreshButtonTap'
            },
            bugmapNavigationView: {
                detailpush: 'onBugmapNavigationViewDetailPush',
                back: 'onBugmapNavigationViewBack'
            }
        },

        map: null,
        ownPositionMarker: null,
        markerLayerGroup: [],
        activeBug: null,
        bugsStore: null,
        messageBoxTemplate: null
    },
    
    /**
     * @private
     * Initilizes the controller
     */
    init: function() {
        var me = this;
        me.callParent(arguments);
        
        // create layer group for bug markers
        me.setMarkerLayerGroup(L.layerGroup());

        me.setBugsStore(Ext.getStore('Bugs'));

        me.setMessageBoxTemplate(
            new Ext.Template(
                '<div class="messagebox-content">',
                    '<div class="textpic">',
                        '<div class="image">',
                            '<img class="koin-image" src="./resources/images/koins/koin_no_value.png" />',
                        '</div>',
                        '<div class="content">',
                            '<p>',
                                Ext.i18n.Bundle.message('bugmap.messagebox.koins.earn'),
                                ' <span class="important">{fix_koin_count}</span> ',
                                Ext.i18n.Bundle.message('bugmap.messagebox.koins.name'),
                            '</p>',
                        '</div>',
                    '</div>',
                    '<div class="textpic">',
                        '<div class="image">',
                            '<img class="bugtype-image" src="./resources/images/marker_icons/{type}.png" />',
                        '</div>',
                        '<div class="content">',
                            '<p>{description}</p>',
                        '</div>',
                    '</div>',
                '</div>'
            )
        );
        
        // adding listener for fixsend event
        me.getApplication().on({
            fixsend: { fn: me.refreshBugMarkers, scope: me }
        });
    },
    
    // @private
    onBugmapNavigationViewDetailPush: function(cmp, view, opts) {
        this.getBugmapCenterButton().hide();
        this.getBugmapRefreshButton().hide();
    },
    
    // @private
    onBugmapNavigationViewBack: function(cmp, view, opts) {
        this.getBugmapCenterButton().show();
        this.getBugmapRefreshButton().show();
    },

    // @private
    onMapRender: function(cmp, map, tileLayer) {
        var me = this;
        me.setMap(map);

        me.refreshBugMarkers();
        me.getMarkerLayerGroup().addTo(map);
    },

    // @private
    onBugmapCenterButtonTap: function() {
        this.centerMapToCurrentPosition();
    },
    
    // @private
    onBugmapRefreshButtonTap: function() {
        this.refreshBugMarkers();
    },
    
    /**
     * @private
     * Centers map to current position
     */
    centerMapToCurrentPosition: function() {
        // centering map to current position
        this.getMapCmp().setMapCenter(this.getCurrentLocationLatLng(this.getMapCmp()));
        this.getMap().setZoom(Kort.util.Config.getLeafletMap().zoom);
    },

    /**
     * @private
     * Reloads and redraws all bug markers
     */
    refreshBugMarkers: function() {
        var me = this,
            mapCmp = me.getMapCmp(),
            bugsStore = me.getBugsStore(),
            currentLatLng;
        
        currentLatLng = me.getCurrentLocationLatLng(mapCmp);
        bugsStore.getProxy().setUrl(Kort.util.Config.getWebservices().bug.getUrl(currentLatLng.lat, currentLatLng.lng));

        me.showLoadMask();

        me.centerMapToCurrentPosition();

        // Load bugs store
		bugsStore.load(function(records, operation, success) {
            me.redrawBugMarkers(records);
        });
    },

    /**
     * @private
     * Removes old and draws new markers
     * @param {Ext.data.Model[]} bugs Array of bug instances
     */
	redrawBugMarkers: function(bugs) {
        var me = this;

        me.removeAllMarkers();

        // add markers
        Ext.each(bugs, function (bug, index, length) {
            if(bug.get('longitude') && bug.get('longitude')) {
                me.addMarker(bug);
            }
        });
        me.hideLoadMask();
	},
    
    /**
     * @private
     * Removes all markers from map
     */
    removeAllMarkers: function() {
        this.getMarkerLayerGroup().clearLayers();
    },

    /**
     * @private
     * Adds marker for given bug
     * @param {Kort.model.Bug} bug Bug instance
     */
    addMarker: function(bug) {
        var me = this,
            icon,
            marker;

        icon = Kort.util.Config.getMarkerIcon(bug.get('type'));
        marker = L.marker([bug.get('latitude'), bug.get('longitude')], {
            icon: icon
        });

        marker.bug = bug;
        marker.lastClickTimestamp = 0;
        marker.on('click', me.onMarkerClick, me);
        me.getMarkerLayerGroup().addLayer(marker);
    },

    /**
     * @private
     * Executed when marker gets clicked
     * @param {L.MouseEvent} e Mouse click event
     */
    onMarkerClick: function(e) {
        var tpl,
            marker = e.target,
            bug = marker.bug,
            CLICK_TOLERANCE = 400,
            timeDifference, bugMessageBox;

        timeDifference = e.originalEvent.timeStamp - marker.lastClickTimestamp;

        // LEAFLET BUGFIX: only execute click if there is a certain time between last click
        if(timeDifference > CLICK_TOLERANCE) {
            tpl = this.getMessageBoxTemplate();
            marker.lastClickTimestamp = e.originalEvent.timeStamp;
            this.setActiveBug(bug);
            bugMessageBox = Ext.create('Kort.view.bugmap.BugMessageBox', {
                record: bug
            });
            bugMessageBox.confirm(bug.get('title'), tpl.apply(bug.data), this.markerConfirmHandler, this);
        }
    },

    // @private
    markerConfirmHandler: function(buttonId, value, opt) {
        if(buttonId === 'yes') {
            this.showFix(this.getActiveBug());
        }

        this.setActiveBug(null);
    },

    /**
     * @private
     * Displays fix detail panel
     * @param {Kort.model.Bug} bug Bug instance
     */
    showFix: function(bug) {
        var bugmapNavigationView = this.getBugmapNavigationView(),
            fixTabPanel;

        fixTabPanel = Ext.create('Kort.view.bugmap.fix.TabPanel', {
            record: bug,
            title: bug.get('title')
        });
        bugmapNavigationView.push(fixTabPanel);
        bugmapNavigationView.fireEvent('detailpush', bugmapNavigationView);
    },
    
    /**
     * @private
     * Shows load mask
     */
    showLoadMask: function() {
        this.getBugmapCenterButton().disable();
        this.getBugmapRefreshButton().disable();
        this.getBugmapNavigationView().setMasked({
            xtype: 'loadmask',
            message: Ext.i18n.Bundle.message('bugmap.loadmask.message'),
            zIndex: Kort.util.Config.getZIndex().overlayLeafletMap
        });
    },
    
    /**
     * @private
     * Hides load mask
     */
    hideLoadMask: function() {
        this.getBugmapNavigationView().setMasked(false);
        this.getBugmapCenterButton().enable();
        this.getBugmapRefreshButton().enable();
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
	}
});

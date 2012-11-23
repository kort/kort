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

    onBugmapNavigationViewDetailPush: function(cmp, view, opts) {
        this.getBugmapCenterButton().hide();
        this.getBugmapRefreshButton().hide();
    },
    onBugmapNavigationViewBack: function(cmp, view, opts) {
        this.getBugmapCenterButton().show();
        this.getBugmapRefreshButton().show();
    },

    onMapRender: function(cmp, map, tileLayer) {
        var me = this;
        me.setMap(map);

        // adding markers
        if(cmp.getGeo()) {
            me.addOwnPositionMarker(cmp, map);

            // add listener for locationupdate event of geolocation for setting marker position
            cmp.getGeo().addListener('locationupdate', function() {
                // this referes to the geolocation
                me.setOwnPositionMarkerPosition(L.latLng(this.getLatitude(), this.getLongitude()));
            });
        }

        // wait until correct position is found
        Ext.Function.defer(me.refreshBugMarkers, 700, me);

        me.getMarkerLayerGroup().addTo(map);
    },

    onBugmapCenterButtonTap: function() {
        this.centerMapToCurrentPosition();
    },
    
    onBugmapRefreshButtonTap: function() {
        this.refreshBugMarkers();
    },
    
    centerMapToCurrentPosition: function() {
        // centering map to current position
        this.getMapCmp().setMapCenter(this.getCurrentLocationLatLng(this.getMapCmp()));
    },

    refreshBugMarkers: function() {
        var me = this,
            mapCmp = me.getMapCmp(),
            bugsStore = me.getBugsStore(),
            url, currentLatLng;
        
        currentLatLng = me.getCurrentLocationLatLng(mapCmp);
        url = './server/webservices/bug/position/' + currentLatLng.lat + ',' + currentLatLng.lng;
        bugsStore.getProxy().setUrl(url);

        me.showLoadMask();

        me.centerMapToCurrentPosition();

        // Load bugs store
		bugsStore.load(function(records, operation, success) {
            me.syncProblemMarkers(records);
        });
    },

    /**
    * Synchronizes problem markers with recieved data from fusiontable
    * @private
    */
	syncProblemMarkers: function(bugs) {
        var me = this;

        me.removeAllMarkers();

        // add markers
        Ext.each(bugs, function (bug, index, length) {
            if(bug.get('longitude') && bug.get('longitude')) {
                console.log(bug.get('osm_type') + ' / ' + bug.get('osm_id') + ' / ' + bug.get('view_type') + ' / ' + bug.get('latitude') + ' / ' + bug.get('longitude'));
                me.addMarker(bug);
            }
        });
        me.hideLoadMask();
	},

    addOwnPositionMarker: function(cmp, map) {
        var iconWidth = 20,
            iconHeight = 20,
            icon,
            ownPositionMarker;

        icon = L.icon({
            iconUrl: './resources/images/marker_icons/own_position.png',
            iconSize: [iconWidth, iconHeight],
            iconAnchor: [(iconWidth/2), (iconHeight/2)]
        });
        ownPositionMarker = L.marker([cmp.getGeo().getLatitude(), cmp.getGeo().getLongitude()], {
            icon: icon,
            clickable: false
        });
        this.setOwnPositionMarker(ownPositionMarker);
        ownPositionMarker.addTo(map);
    },

    /**
     * Sets position of own position marker
     * @param latlng position of marker
     * @private
     */
    setOwnPositionMarkerPosition: function(latlng) {
        var ownPositionMarker = this.getOwnPositionMarker();
        if(ownPositionMarker) {
            ownPositionMarker.setLatLng(latlng);
        }
    },

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

    removeAllMarkers: function() {
        this.getMarkerLayerGroup().clearLayers();
    },

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

    markerConfirmHandler: function(buttonId, value, opt) {
        if(buttonId === 'yes') {
            console.log('Open fix (id: ' + this.getActiveBug().data.id + ')');
            this.showFix(this.getActiveBug());
        }

        this.setActiveBug(null);
    },

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

    showLoadMask: function() {
        this.getBugmapRefreshButton().disable();
        this.getBugmapNavigationView().setMasked({
            xtype: 'loadmask',
            message: Ext.i18n.Bundle.message('bugmap.loadmask.message'),
            zIndex: Kort.util.Config.getZIndex().overlayLeafletMap
        });
    },

    hideLoadMask: function() {
        this.getBugmapNavigationView().setMasked(false);
        this.getBugmapRefreshButton().enable();
    },
    
    /**
	 * Returns current location
	 * @private
	 */
	getCurrentLocationLatLng: function(mapCmp) {
		if(mapCmp.getUseCurrentLocation()) {
            var geo = mapCmp.getGeo();
			return L.latLng(geo.getLatitude(), geo.getLongitude());
		} else {
			return mapCmp.getMap().getCenter();
		}
	},

    init: function() {
        // create layer group for bug markers
        this.setMarkerLayerGroup(L.layerGroup());

        this.setBugsStore(Ext.getStore('Bugs'));

        this.setMessageBoxTemplate(
            new Ext.Template(
                '<div class="messagebox-content">',
                    '<div class="textpic">',
                        '<div class="image">',
                            '<img class="bugtype-image" src="./resources/images/marker_icons/{type}.png" />',
                        '</div>',
                        '<div class="content">',
                            '<p>{description}</p>',
                        '</div>',
                    '</div>',
                    '<div class="textpic">',
                        '<div class="image">',
                            '<img class="koin-image" src="./resources/images/koins/koin_no_value.png" />',
                        '</div>',
                        '<div class="content">',
                            '<p>',
                                Ext.i18n.Bundle.message('bugmap.messagebox.koins.earn'),
                                ' <span class="important">{koin_count}</span> ',
                                Ext.i18n.Bundle.message('bugmap.messagebox.koins.name'),
                            '</p>',
                        '</div>',
                    '</div>',
                '</div>'
            )
        );
    }
});

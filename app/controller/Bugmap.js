/**
 * Controller for bugmap tab
 */
Ext.define('Kort.controller.Bugmap', {
    extend: 'Kort.controller.MarkerMap',
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

        bugsStore: null,
        messageBoxTemplate: null,
        activeRecord: null
    },
    
    /**
     * @private
     * Initilizes the controller
     */
    init: function() {
        var me = this;
        me.callParent(arguments);

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
            fixsend: { fn: me.loadStore, scope: me },
            geolocationready: { fn: me.geolocationReady, scope: me }
        });

        me.getBugsStore().on('load', me.refreshView, me);
    },
    
    /**
     * @private
     * Called when geolocation is ready to use.
     * Adds LeafletMap component to bugmap view.
     */
    geolocationReady: function(geo) {
        var bugmap = {
            xtype: 'kortleafletmap',
            title: Ext.i18n.Bundle.message('bugmap.title'),
            useCurrentLocation: geo,
            id: 'bugmap'
        };
        this.getBugmapNavigationView().add(bugmap);
        this.loadStore(true);
    },

    /**
     * @private
     * Loads bugs store
     */
    loadStore: function(showLoadmask) {
        var me = this,
            mapCmp = me.getMapCmp(),
            bugsStore = me.getBugsStore(),
            currentLatLng;

        currentLatLng = me.getCurrentLocationLatLng(mapCmp);
        bugsStore.getProxy().setUrl(Kort.util.Config.getWebservices().bug.getUrl(currentLatLng.lat, currentLatLng.lng));

        if(showLoadmask) {
            me.showLoadMask();
        }

        // Load bugs store
		bugsStore.load();
    },

    /**
     * @private
     * Reloads and redraws all markers
     */
    refreshView: function() {
        this.centerMapToCurrentPosition();
        this.redrawMarkers(this.getBugsStore().getData().all);
        this.hideLoadMask();
    },

    /**
     * @private
     * Executed when marker gets clicked
     * @param {L.MouseEvent} e Mouse click event
     */
    onMarkerClick: function(e) {
        var tpl,
            marker = e.target,
            record = marker.record,
            CLICK_TOLERANCE = 400,
            timeDifference, bugMessageBox;

        timeDifference = e.originalEvent.timeStamp - marker.lastClickTimestamp;

        // LEAFLET BUGFIX: only execute click if there is a certain time between last click
        if(timeDifference > CLICK_TOLERANCE) {
            tpl = this.getMessageBoxTemplate();
            marker.lastClickTimestamp = e.originalEvent.timeStamp;
            this.setActiveRecord(record);
            bugMessageBox = Ext.create('Kort.view.bugmap.BugMessageBox', {
                record: record
            });
            bugMessageBox.confirm(record.get('title'), tpl.apply(record.data), this.markerConfirmHandler, this);
        }
    },

    // @private
    markerConfirmHandler: function(buttonId, value, opt) {
        if(buttonId === 'yes') {
            this.showFix(this.getActiveRecord());
        }

        this.setActiveRecord(null);
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
    onBugmapCenterButtonTap: function() {
        this.centerMapToCurrentPosition();
    },
    
    // @private
    onBugmapRefreshButtonTap: function() {
        this.loadStore(true);
    }
});

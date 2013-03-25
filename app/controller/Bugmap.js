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
            extViewPort: '#ext-viewport',
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
            },
            bugmapInformationButton: {
                tap: 'displayCampaignMessageBox'
            }
        },

        bugsStore: null,
        campaignStore: null,
        messageBoxTemplate: null,
        activeRecord: null,
        bugmapView: null,
        campaignMessageBox: null

    },

    /**
     * @private
     * Initilizes the controller
     */
    init: function () {
        var me = this;

        me.callParent(arguments);

        me.setBugsStore(Ext.getStore('Bugs'));
        me.setCampaignStore(Ext.getStore('Campaigns'));

        me.setMessageBoxTemplate(

            new Ext.XTemplate(

                '<div class="messagebox-content">',
                '<div class="textpic">',
                '<div class="image">',
                '<img class="koin-image" src="./resources/images/koins/koin_no_value.png" />',
                '</div>',
                '<div class="content">',

                '<tpl if="this.isCampaign()">',
                '<p>',

                '{[this.getMessage("bugmap.messagebox.koins.earncamp", {fix_koin_count: values.fix_koin_count, ' +
                    'extra_coins: values.campaign_extra_coins})]}',
                '<img class="koin-image" src="./resources/images/i.png" id="campaignInfoButton"/>',
                '</p>',
                ' <tpl else>',
                '<p>',
                '{[this.getMessage("bugmap.messagebox.koins.earn", {fix_koin_count: values.fix_koin_count})]}',
                '</p>',
                '</tpl>',
                '</div>',
                '</div>',
                '<div class="textpic">',
                '<div class="image">',
                '<img class="bugtype-image" src="./resources/images/marker_icons/{type}@2x.png" />',
                '</div>',
                '<div class="content">',
                '<p>{description}</p>',
                '</div>',
                '</div>',
                '</div>',

                /*
                 '<div class="image">',
                 '<img class="bugtype-image" src="./resources/images/circle.png" />',
                 '</div>',
                 */
                {
                    //member functions:
                    isCampaign: function () {
                        return true;
                    }
                }
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
    geolocationReady: function (geo) {
        var bugmap = Ext.create('Kort.view.LeafletMap', {
            title: Ext.i18n.Bundle.message('bugmap.title'),
            useCurrentLocation: geo,
            id: 'bugmap'
        });
        this.setBugmapView(bugmap);
        /*
         var bugmap = {
         xtype: 'kortleafletmap',
         title: Ext.i18n.Bundle.message('bugmap.title'),
         useCurrentLocation: geo,
         id: 'bugmap'
         };
         */
        this.getBugmapNavigationView().add(bugmap);
        this.loadStore(true);
    },

    /**
     * @private
     * Loads bugs store
     */
    loadStore: function (showLoadmask) {
        var me = this,
            mapCmp = me.getMapCmp(),
            bugsStore = me.getBugsStore(),
            campaignStore = me.getCampaignStore(),
            currentLatLng;

        currentLatLng = me.getCurrentLocationLatLng(mapCmp);
        bugsStore.getProxy().setUrl(Kort.util.Config.getWebservices().bug.getUrl(currentLatLng.lat, currentLatLng.lng));

        if (showLoadmask) {
            me.showLoadMask();
        }

        // Load bugs store
        bugsStore.load();
        campaignStore.load();
    },

    /**
     * @private
     * Reloads and redraws all markers
     */
    refreshView: function () {
        this.redrawMarkers(this.getBugsStore().getData().all, 'bug');
        this.hideLoadMask();
    },

    /**
     * @private
     * Executed when marker gets clicked
     * @param {L.MouseEvent} e Mouse click event
     */

    onMarkerClick: function (e) {
        console.log(e.target.source);
        var tpl,
            marker = e.target,
            record = marker.record,
            CLICK_TOLERANCE = 400,
            timeDifference, bugMessageBox, campaignOverlay;

        timeDifference = e.originalEvent.timeStamp - marker.lastClickTimestamp;

        // LEAFLET BUGFIX: only execute click if there is a certain time between last click
        if (timeDifference > CLICK_TOLERANCE) {
            tpl = this.getMessageBoxTemplate();
            marker.lastClickTimestamp = e.originalEvent.timeStamp;
            this.setActiveRecord(record);
            bugMessageBox = Ext.create('Kort.view.bugmap.BugMessageBox', {
                record: record
            });
            bugMessageBox.confirm(record.get('title'), tpl.apply(record.data), this.markerConfirmHandler, this);

            campaignOverlay = Ext.create('Kort.view.bugmap.CampaignOverlay', {
                record: record
            });

            this.getBugmapView().add(campaignOverlay);


            var campaigns = this.getCampaignStore ();
             var campaign = campaigns.getById(record.get("campaign_id"));

            this.setCampaignMessageBox(Ext.create('Ext.MessageBox', {

                cls: "emptyMessageBox",
                style: 'background-color: transparent;',
                record: campaign,
                tpl: new Ext.XTemplate(
                    '<div>{id}</div>', ' <br>', ' <br>',
                    '<div align="center"><b>{title}</b></div>',
                    ' <br>',
                    ' <div align="center">{startdate} bis {enddate}</div>',
                    '<div align="center">Hol dir zusätzliche {extra_coins} Koins!</div>',
                    ' <br>', ' <br>',
                    ' <div align="center"><a href="">Close</a></div>'

                ),
                zIndex: Kort.util.Config.getZIndex().overlayLeafletMap + 1
            }));


        }
    },

    // @private
    markerConfirmHandler: function (buttonId, value, opt) {
        if (buttonId === 'yes') {
            this.showFix(this.getActiveRecord());
        }
        this.setActiveRecord(null);
    },

    /**
     * @private
     * Displays fix detail panel
     * @param {Kort.model.Bug} bug Bug instance
     */
    showFix: function (bug) {
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
    showLoadMask: function () {
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
    hideLoadMask: function () {
        this.getBugmapNavigationView().setMasked(false);
        this.getBugmapCenterButton().enable();
        this.getBugmapRefreshButton().enable();
    },

    // @private
    onBugmapNavigationViewDetailPush: function (cmp, view, opts) {
        this.getBugmapCenterButton().hide();
        this.getBugmapRefreshButton().hide();
    },

    // @private
    onBugmapNavigationViewBack: function (cmp, view, opts) {
        this.getBugmapCenterButton().show();
        this.getBugmapRefreshButton().show();
    },

    // @private
    onBugmapCenterButtonTap: function () {
        this.centerMapToCurrentPosition();
    },

    // @private
    onBugmapRefreshButtonTap: function () {
        this.centerMapToCurrentPosition();
        this.loadStore(true);
    },

    displayCampaignMessageBox: function () {
        if (this.getCampaignMessageBox()) {
            this.getCampaignMessageBox().show();
        }

    }

});

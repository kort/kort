Ext.define('Kort.controller.Main', {
    extend: 'Ext.app.Controller',

    config: {
        views: [
            'Main'
        ],
        refs: {
            mainTabPanel: '#mainTabPanel',
            bugmap: '#bugmap'
        },
        control: {
            mainTabPanel: {
                activeitemchange: 'onMainTabPanelActiveItemChange',
                initialize: 'onMainTabPanelInitialize'
            },
            bugmap: {
                maprender: 'onBugmapRender'
            }
        },
        routes: {
            'bugmap': 'showBugmap',
            'bugmap/:lat/:lng': {
                action: 'showBugmap',
                // only allow floating numbers for latitude and longitude
                conditions: {
                    ':lat': "[0-9]+\\.+[0-9]+",
                    ':lng': "[0-9]+\\.+[0-9]+"
                }
            },
            'bugmap/show/:bugid': 'showBug',
            'profile': 'showProfile'
        },

        initView: null,
        initLat: null,
        initLng: null,
        redirect: true,
        centerToOwnPosition: true,
        bugmapRendered: false
    },

    onBugmapRender: function() {
        this.setBugmapRendered(true);
    },

    /**
     * Called when tabpanel is initialized
     * @private
     */
    onMainTabPanelInitialize: function(container, eOpts) {
        var viewName = this.getInitView();
        Ext.Logger.log('mainTabPanel initalized (viewName: ' + viewName + ', lat: ' + this.getInitLat() + ', lng: ' + this.getInitLng() + ')');

        // if initial view is set redirect to this view
        if (viewName) {
            Ext.Logger.log('redirect to ' + viewName);
            if (this.getInitLat()) {
                this.redirectTo(viewName + '/' + this.getInitLat() + '/' + this.getInitLng());
            } else {
                this.redirectTo(viewName);
            }
            this.setInitView(null);
        }
    },

    /**
     * Called when active item of tabpanel changes
     * @private
     */
    onMainTabPanelActiveItemChange: function(container, value, oldValue, eOpts) {
        if (this.getRedirect()) {
            this.redirectTo(value.getUrl());
        }
    },

    /**
     * Shows list view
     * @private
     */
    showProfile: function() {
        var viewName = 'profile';
        this.saveInitView(viewName);
        this.switchView(viewName);
    },

    /**
     * Shows map view
     * @param lat latitude for map center
     * @param lng longitude for map center
     * @private
     */
    showBugmap: function(lat, lng) {
        var viewName = 'bugmap';
        this.saveInitView(viewName, lat, lng);
        this.centerMap(lat, lng);
        this.switchView(viewName);
    },

    showBug: function(id) {
        Ext.Logger.log('opening bug detail: ' + id);
        var viewName = 'bugmap';
        this.switchView(viewName);
    },

    /**
     * Centers problem map to given position
     * @param lat latitude for map center
     * @param lng longitude for map center
     * @private
     */
    centerMap: function(lat, lng) {
        if(this.getBugmap() && lat && lng) {
            if(!this.getBugmapRendered()) {
                // Timeout to center map correctly on first call (wait till map is correctly rendered)
                Ext.defer(function() {
                    this.centerMap(lat, lng);
                }, 500, this);
            } else {
                this.getBugmap().setMapCenter(L.latLng(this.getInitLat(), this.getInitLng()));

                this.setInitLat(null);
                this.setInitLng(null);
            }
        }
    },

    /**
     * Saves the init state
     * @param viewName name of view to show
     * @param lat latitude for map center
     * @param lng longitude for map center
     * @private
     */
    saveInitView: function(viewName, lat, lng) {
        if (lat) {
            this.setCenterToOwnPosition(false);
        }
        this.setInitView(viewName);
        this.setInitLat(lat);
        this.setInitLng(lng);
    },

    /**
     * Switches view to given viewname
     * @param viewName name of view to show
     * @private
     */
    switchView: function(viewName) {
        if (this.getMainTabPanel()) {
            var viewNr = this.getViewNr(viewName);
            this.setRedirect(false);
            this.getMainTabPanel().setActiveItem(viewNr);
            this.setRedirect(true);
        }
    },

    // returns position of each view in tabpanel
    getViewNr: function(viewName) {
        var views = {
            'bugmap': 0,
            'profile': 1
        };
        return views[viewName];
    }
});
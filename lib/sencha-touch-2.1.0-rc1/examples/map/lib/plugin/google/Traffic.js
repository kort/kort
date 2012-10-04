Ext.define('Ext.plugin.google.Traffic', {
    extend: 'Ext.EventedBase',
    alias: 'plugin.gmaptraffic',

    config: {
        /**
         * @property {Boolean} hidden
         */
        hidden: null,

        host: null
    },

    /**
     * Initialize the plugin, binding to the host Ext.Map instance
     * @param {Ext.Map} host
     */
    init : function(host) {
        if (host && host.isMap === true) {
            this.setHost(host);
            var map = host.getMap();

            if (!map) {
                host.on('maprender', 'onMapRender', this);
            }
            else {
                this.onMapRender(host, map);
            }
        }
    },

    // @private
    onMapRender : function(host, map) {
        var overlay = this.getOverlay();

        if (overlay && !this.getHidden()) {
            overlay.setMap(map);
        }
    },

    getOverlay: function() {
        if (!this.overlay && (window.google || {}).maps) {
            this.overlay = new google.maps.TrafficLayer();
        }
        return this.overlay;
    },

    applyHidden: function(config) {
        return Boolean(config);
    },

    updateHidden: function(hidden) {
        var overlay = this.getOverlay(),
            host;
        if (overlay) {
            if (hidden) {
                overlay.setMap(null);
            }
            else {
                host = this.getHost();
                if (host && host.isMap === true) {
                    overlay.setMap(host.getMap());
                }
            }
        }
    },

    show : function() {
        this.setHidden(false);

    },

    hide : function() {
        this.setHidden(true);
    }
});

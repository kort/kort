Ext.define('Kort.controller.Main', {
    extend: 'Ext.app.Controller',

    config: {
        views: [
            'Main',
            'NotificationMessageBox',
            'LeafletMap'
        ],
        refs: {
            mainTabPanel: '#mainTabPanel',
            bugmapNavigationView: '#bugmapNavigationView'
        },
        control: {
            mainTabPanel: {
                activeitemchange: 'onMainTabPanelActiveItemChange'
            }
        }
    },

    /**
     * Called when active item of tabpanel changes
     * @private
     */
    onMainTabPanelActiveItemChange: function(container, newCmp, oldCmp, eOpts) {
        this.redirectTo(newCmp.getUrl());
    }
});
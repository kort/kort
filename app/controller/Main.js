Ext.define('Kort.controller.Main', {
    extend: 'Ext.app.Controller',

    config: {
        views: [
            'Main'
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
        if(oldCmp === this.getBugmapNavigationView()) {
            console.log('should pop detail view');
        }
        this.redirectTo(newCmp.getUrl());
    }
});
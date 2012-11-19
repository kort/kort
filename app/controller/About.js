Ext.define('Kort.controller.About', {
    extend: 'Ext.app.Controller',
    
    config: {
        views: [
            'about.Container'
        ],
        refs: {
            mainTabPanel: '#mainTabPanel',
            aboutContainer: '#aboutContainer'
        },
        routes: {
            'about': 'showAbout'
        }
    },
    
    showAbout: function() {
        this.getMainTabPanel().setActiveItem(this.getAboutContainer());
    }
});
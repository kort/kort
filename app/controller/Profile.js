Ext.define('Kort.controller.Profile', {
    extend: 'Ext.app.Controller',
    
    config: {
        views: [
            'profile.Container'
        ],
        refs: {
            mainTabPanel: '#mainTabPanel',
            profileContainer: '#profileContainer'
        },
        routes: {
            'profile': 'showProfile'
        }
    },
    
    showProfile: function() {
        this.getMainTabPanel().setActiveItem(this.getProfileContainer());
    }
});
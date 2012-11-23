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
            aboutContainer: '#aboutContainer',
            bugmapNavigationView: '#bugmapNavigationView',
            highscoreContainer: '#highscoreContainer',
            profileContainer: '#profileContainer',
            validationNavigationView: '#validationNavigationView'
        },
        control: {
            mainTabPanel: {
                activeitemchange: 'onMainTabPanelActiveItemChange'
            }
        },

        routes: {
            'about': 'showAbout',
            'bugmap': 'showBugmap',
            'highscore': 'showHighscore',
            'profile': 'showProfile',
            'validation': 'showValidation'
        }
    },

    /**
     * Called when active item of tabpanel changes
     * @private
     */
    onMainTabPanelActiveItemChange: function(container, newCmp, oldCmp, eOpts) {
        this.redirectTo(newCmp.getUrl());
    },
    
    showAbout: function() {
        this.showView(this.getAboutContainer());
    },
    showBugmap: function() {
        this.showView(this.getBugmapNavigationView());
    },
    showHighscore: function() {
        this.showView(this.getHighscoreContainer());
    },
    showProfile: function() {
        this.showView(this.getProfileContainer());
    },
    showValidation: function() {
        this.showView(this.getValidationNavigationView());
    },
    
    showView: function(viewCmp) {
        if(this.getMainTabPanel()) {
            this.getMainTabPanel().setActiveItem(viewCmp);
        }
    }
});
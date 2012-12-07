/**
 * Main controller for application
 */
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
     * @private
     * Called when active item of main tabpanel changes
     */
    onMainTabPanelActiveItemChange: function(container, newCmp, oldCmp, eOpts) {
        this.redirectTo(newCmp.getUrl());
    },
    
    /**
     * @private
     * redirects to about tab
     */
    showAbout: function() {
        this.showView(this.getAboutContainer());
    },
    
    /**
     * @private
     * redirects to bugmap tab
     */
    showBugmap: function() {
        this.showView(this.getBugmapNavigationView());
    },
    
    /**
     * @private
     * redirects to highscore tab
     */
    showHighscore: function() {
        this.showView(this.getHighscoreContainer());
    },
    
    /**
     * @private
     * redirects to profile tab
     */
    showProfile: function() {
        this.showView(this.getProfileContainer());
    },
    
    /**
     * @private
     * redirects to validation tab
     */
    showValidation: function() {
        this.showView(this.getValidationNavigationView());
    },
    
    /**
     * @private
     * redirects to given component
     * @param {Ext.Component} viewCmp Component which should be displayed
     */
    showView: function(viewCmp) {
        if(this.getMainTabPanel()) {
            this.getMainTabPanel().setActiveItem(viewCmp);
        }
    }
});
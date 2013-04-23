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
            mapNavigationView: '#markermapNavigationView',
            highscoreNavigationView: '#highscoreNavigationView',
            highscoreList: '#highscoreNavigationView .highscorelist',
            profileContainer: '#profileContainer',
            newsNavigationView: '#newsNavigationView'
        },
        control: {
            mainTabPanel: {
                activeitemchange: 'onMainTabPanelActiveItemChange'
            }
        },

        routes: {
            'about': 'showAbout',
            'map': 'showMap',
            'highscore': 'showHighscore',
            'profile': 'showProfile',
            'news': 'showNews'
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
     * redirects to about tab
     */
    showAbout: function() {
        this.showView(this.getAboutContainer());
    },
    
    /**
     * redirects to map tab
     */
    showMap: function() {
        this.showView(this.getMapNavigationView());
    },
    
    /**
     * redirects to highscore tab
     */
    showHighscore: function() {
        this.showView(this.getHighscoreNavigationView());
        this.getHighscoreList().refresh();
    },
    
    /**
     * redirects to profile tab
     */
    showProfile: function() {
        this.showView(this.getProfileContainer());
    },

    /**
     * redirects to news tab
     */
    showNews: function(){
        this.showView(this.getNewsNavigationView());
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
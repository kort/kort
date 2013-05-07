/**
 * Main controller for application
 */
Ext.define('Kort.controller.Main', {
    extend: 'Ext.app.Controller',

    config: {
        views: [
            'Main',
            'NotificationMessageBox'
        ],
        refs: {
            mainTabPanel: '#mainTabPanel',
            aboutContainer: '#aboutContainer',
            mapNavigationView: '#mapNavigationView',
            highscoreNavigationView: '#highscoreNavigationView',
            highscoreList: '#highscoreNavigationView .highscorelist',
            profileContainer: '#profileContainer',
            newsNavigationView: '#newsNavigationView'
        },
        control: {
            mainTabPanel: {
                activeitemchange: '_onMainTabPanelActiveItemChange'
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
     *
     * redirects to about tab
     */
    showAbout: function() {
        this._showView(this.getAboutContainer());
    },
    
    /**
     *
     * redirects to map tab
     */
    showMap: function() {
        this._showView(this.getMapNavigationView());
    },
    
    /**
     *
     * redirects to highscore tab
     */
    showHighscore: function() {
        this._showView(this.getHighscoreNavigationView());
        this.getHighscoreList().refresh();
    },
    
    /**
     *
     * redirects to profile tab
     */
    showProfile: function() {
        this._showView(this.getProfileContainer());
    },

    /**
     *
     * redirects to news tab
     */
    showNews: function(){
        this._showView(this.getNewsNavigationView());
    },
    
    /**
     *
     * @private
     * redirects to given component
     * @param {Ext.Component} viewCmp Component which should be displayed
     */
    _showView: function(viewCmp) {
        if(this.getMainTabPanel()) {
            this.getMainTabPanel().setActiveItem(viewCmp);
        }
    },

    /**
     *
     * @private
     * @param {Ext.Container} container
     * @param {Object} newCmp
     * @param {Object} oldCmp
     * @param {Object} eOpts
     *
     * Called when active item of main tabpanel changes
     */
    _onMainTabPanelActiveItemChange: function(container, newCmp, oldCmp, eOpts) {
        this.redirectTo(newCmp.getUrl());
    }
});
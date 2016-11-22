/**
 * Main controller for application.
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
            profileContainer: '#profileContainer'
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
            'profile': 'showProfile'
        }
    },

    /**
     * Redirects to about tab.
     */
    showAbout: function() {
        this._showView(this.getAboutContainer());
    },
    
    /**
     * Redirects to map tab.
     */
    showMap: function() {
        this._showView(this.getMapNavigationView());
    },
    
    /**
     * Redirects to highscore tab.
     */
    showHighscore: function() {
        this._showView(this.getHighscoreNavigationView());
        Kort.app.getController('Highscore').refreshAllLists();
    },
    
    /**
     * Redirects to profile tab.
     */
    showProfile: function() {
        this._showView(this.getProfileContainer());
    },
    
    /**
     * @private
     * Redirects to given component.
     * @param {Ext.Component} viewCmp Component which should be displayed.
     */
    _showView: function(viewCmp) {
        if(this.getMainTabPanel()) {
            this.getMainTabPanel().setActiveItem(viewCmp);
        }
    },

    /**
     * @private
     * Called when active item of main tabpanel changes.
     * @param {Ext.Container} container
     * @param {Object} newCmp
     * @param {Object} oldCmp
     * @param {Object} eOpts
     */
    _onMainTabPanelActiveItemChange: function(container, newCmp, oldCmp, eOpts) {
        this.redirectTo(newCmp.getUrl());
    }
});
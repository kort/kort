Ext.define('Kort.controller.Highscore', {
    extend: 'Ext.app.Controller',
    
    config: {
        views: [
            'highscore.Container',
            'highscore.List'
        ],
        refs: {
            mainTabPanel: '#mainTabPanel',
            highscoreContainer: '#highscoreContainer'
        },
        routes: {
            'highscore': 'showHighscore'
        }
    },
    
    showHighscore: function() {
        Ext.getStore('Highscore').load();
        this.getMainTabPanel().setActiveItem(this.getHighscoreContainer());
    }
});
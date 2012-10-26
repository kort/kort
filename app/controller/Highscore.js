Ext.define('Kort.controller.Highscore', {
    extend: 'Ext.app.Controller',
    
    config: {
        views: [
            'highscore.Container'
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
        this.getMainTabPanel().setActiveItem(this.getHighscoreContainer());
    }
});
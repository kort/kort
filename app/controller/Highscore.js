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
            //'highscore': 'showHighscore'
        }
    },
    
    showHighscore: function() {
        console.log(this.getHighscoreContainer());
        this.getMainTabPanel().setActiveItem(this.getHighscoreContainer());
    }
});
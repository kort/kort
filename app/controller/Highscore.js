Ext.define('Kort.controller.Highscore', {
    extend: 'Ext.app.Controller',
    
    config: {
        views: [
            'highscore.Container',
            'highscore.List'
        ],
        refs: {
            mainTabPanel: '#mainTabPanel',
            highscoreContainer: '#highscoreContainer',
            highscoreList: '.highscorelist'
        }
    },
    
    init: function() {
        var me = this;
        me.callParent(arguments);
        
        me.getApplication().on({
            votesend: { fn: me.refreshView, scope: me },
            fixsend: { fn: me.refreshView, scope: me },
            usersave: { fn: me.refreshView, scoep: me }
        });
    },
    
    refreshView: function() {
        var me = this;
        
        if(me.getHighscoreList()) {
            Ext.getStore('Highscore').load(function(records, operation, success) {
                me.getHighscoreList().refresh();
            });
        }
    }
});
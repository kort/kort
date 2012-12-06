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
            highscoreList: '.highscorelist',
            highscoreRefreshButton: '#highscoreContainer .button[cls=highscoreRefreshButton]'
        },
        control: {
            highscoreRefreshButton: {
                tap: 'onHighscoreRefreshButtonTap'
            }
        }
    },
    
    init: function() {
        var me = this;
        me.callParent(arguments);
        
        me.getApplication().on({
            votesend: { fn: me.refreshView, scope: me },
            fixsend: { fn: me.refreshView, scope: me },
            usersave: { fn: me.refreshView, scope: me }
        });
    },
    
    onHighscoreRefreshButtonTap: function() {
        this.refreshView();
    },
    
    refreshView: function() {
        var me = this,
            highscoreStore = Ext.getStore('Highscore');
        
        if(me.getHighscoreList()) {
            me.getHighscoreList().mask();
            
            highscoreStore.load(function(records, operation, success) {
                me.getHighscoreList().refresh();
                me.getHighscoreList().unmask();
            });
        }
    }
});
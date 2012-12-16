/**
 * Controller for highscore tab
 */
Ext.define('Kort.controller.Highscore', {
    extend: 'Ext.app.Controller',
    
    config: {
        views: [
            'highscore.NavigationView',
            'highscore.List',
            'highscore.user.Container'
        ],
        refs: {
            mainTabPanel: '#mainTabPanel',
            highscoreNavigationView: '#highscoreNavigationView',
            highscoreList: '.highscorelist',
            highscoreRefreshButton: '#highscoreNavigationView .button[cls=highscoreRefreshButton]'
        },
        control: {
            highscoreRefreshButton: {
                tap: 'onHighscoreRefreshButtonTap'
            },
            highscoreNavigationView: {
                detailpush: 'onHighscoreNavigationViewDetailPush',
                back: 'onHighscoreNavigationViewBack'
            },
            highscoreList: {
                itemtap: 'onHighscoreListItemTap'
            }
        },
        
        itemTapDisabled: false
    },
    
    /**
     * @private
     * Initilizes the controller
     */
    init: function() {
        var me = this;
        me.callParent(arguments);
        
        me.getApplication().on({
            votesend: { fn: me.refreshView, scope: me },
            fixsend: { fn: me.refreshView, scope: me },
            userchange: { fn: me.refreshView, scope: me }
        });
    },
    
    // @private
    onHighscoreRefreshButtonTap: function() {
        this.refreshView();
    },
    
    /**
     * @private
     * Displays highscore user panel for given user
     */
    onHighscoreListItemTap: function(list, index, target, record, e) {
        var me = this,
            highscoreUserBadgesStore = Ext.getStore('HighscoreUserBadges'),
            highscoreNavigationView = me.getHighscoreNavigationView(),
            highscoreUserContainer;
        
        if(!me.getItemTapDisabled()) {
            me.setItemTapDisabled(true);
            
            // loading badges of user
            highscoreUserBadgesStore.getProxy().setUrl(Kort.util.Config.getWebservices().userBadges.getUrl(record.get('user_id')));
            highscoreUserBadgesStore.load();
        
            highscoreUserContainer = Ext.create('Kort.view.highscore.user.Container', {
                record: record,
                title: record.get('username')
            });
            highscoreNavigationView.push(highscoreUserContainer);
            highscoreNavigationView.fireEvent('detailpush', highscoreNavigationView);
        }
        Ext.defer(function() {
            me.setItemTapDisabled(false);
        }, 200);
    },
    
    /**
     * @private
     * Refreshs highscore
     */
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
    },
    
    // @private
    onHighscoreNavigationViewDetailPush: function(cmp, view, opts) {
        this.getHighscoreRefreshButton().hide();
    },
    
    // @private
    onHighscoreNavigationViewBack: function(cmp, view, opts) {
        this.getHighscoreRefreshButton().show();
    }
});
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
            highscoreRefreshButton: '#highscoreNavigationView .button[cls=highscoreRefreshButton]',
            profileContainer: '#profileContainer'
        },
        control: {
            highscoreRefreshButton: {
                tap: 'onHighscoreRefreshButtonTap'
            },
            highscoreNavigationView: {
                initialize: 'onHighscoreNavigationViewInitialize',
                detailpush: 'onHighscoreNavigationViewDetailPush',
                back: 'onHighscoreNavigationViewBack'
            },
            highscoreList: {
                itemtap: 'onHighscoreListItemTap'
            }
        },
        
        detailPushDisabled: false
    },
    
    /**
     * @private
     * Initilizes the controller
     */
    init: function() {
        var me = this;
        me.callParent(arguments);
        
        me.getApplication().on({
            votesend: { fn: me.loadStore, scope: me },
            fixsend: { fn: me.loadStore, scope: me },
            userchange: { fn: me.loadStore, scope: me }
        });

        Ext.getStore('Highscore').on('load', me.refreshView, me);
    },

    onHighscoreNavigationViewInitialize: function() {
        this.loadStore(true);
    },
    
    // @private
    onHighscoreRefreshButtonTap: function() {
        this.loadStore(true);
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
        
        if(!me.getDetailPushDisabled()) {
            // disable fast tapping
            me.setDetailPushDisabled(true);
            
            if(record.get('you')) {
                me.getMainTabPanel().setActiveItem(me.getProfileContainer());
            } else {
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
        }
    },
    
    /**
     * @private
     * Loads highscore store
     */
    loadStore: function(showLoadmask) {
        var highscoreStore = Ext.getStore('Highscore');

        if(showLoadmask) {
            this.showLoadMask();
        }
        highscoreStore.load();
    },

    /**
     * @private
     * Refreshs highscore
     */
    refreshView: function() {
        if(this.getHighscoreList()) {
            this.getHighscoreList().refresh();
        }
        this.hideLoadMask();
    },

    /**
     * @private
     * Shows load mask
     */
    showLoadMask: function() {
        this.getHighscoreRefreshButton().disable();
        this.getHighscoreNavigationView().setMasked({
            xtype: 'loadmask',
            message: Ext.i18n.Bundle.message('highscore.loadmask.message'),
            zIndex: Kort.util.Config.getZIndex().overlayLeafletMap
        });
    },
    
    /**
     * @private
     * Hides load mask
     */
    hideLoadMask: function() {
        this.getHighscoreNavigationView().setMasked(false);
        this.getHighscoreRefreshButton().enable();
    },
    
    // @private
    onHighscoreNavigationViewDetailPush: function(cmp, view, opts) {
        var me = this;

        me.getHighscoreRefreshButton().hide();

        // reenable detail push after certain time
        Ext.defer(function() {
            me.setDetailPushDisabled(false);
        }, 2000);
    },
    
    // @private
    onHighscoreNavigationViewBack: function(cmp, view, opts) {
        this.getHighscoreRefreshButton().show();
    }
});
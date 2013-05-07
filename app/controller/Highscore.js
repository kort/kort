/**
 * Controller for highscore tab.
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
                tap: '_onHighscoreRefreshButtonTap'
            },
            highscoreNavigationView: {
                detailpush: '_onHighscoreNavigationViewDetailPush',
                back: '_onHighscoreNavigationViewBack'
            },
            highscoreList: {
                itemtap: '_onHighscoreListItemTap'
            }
        },

        /**
         * @private
         */
        detailPushDisabled: false,
        /**
         * @private
         */
        highscoreStore: null
    },

    /**
     * @private
     */
    init: function() {
        var me = this,
            highscoreStore = Ext.getStore('Highscore');
        me.callParent(arguments);
        me.setHighscoreStore(highscoreStore);
        me.getApplication().on({
            votesend: { fn: me._loadStore, scope: me },
            fixsend: { fn: me._loadStore, scope: me },
            userchange: { fn: me._loadStore, scope: me }
        });
        highscoreStore.on({
            load: { fn: me.refreshView, scope: me }
        });
    },

    /**
     * Refreshes highscore list.
     */
    refreshView: function() {
        if(this.getHighscoreList()) {
            this.getHighscoreList().refresh();
        }
        this._hideLoadMask();
    },


    /**
     * @private
     */
    _onHighscoreRefreshButtonTap: function() {
        this._loadStore(true);
    },

    /**
     * @private
     * Displays highscore user panel for given user.
     * @param {Kort.view.highscore.List} list
     * @param {Number} index
     * @param {Ext.dataview.component.DataItem} target
     * @param {Kort.model.HighscoreEntry} record
     * @param {Ext.EventObject} e
     */
    _onHighscoreListItemTap: function(list, index, target, record, e) {
        var me = this,
            highscoreUserBadgesStore = Ext.getStore('HighscoreUserBadges'),
            highscoreNavigationView = me.getHighscoreNavigationView(),
            highscoreUserContainer;
        
        if(!me.getDetailPushDisabled()) {
            // disable fast tapping
            me.setDetailPushDisabled(true);
            
            if(record.get('you')) {
                // reenable detail push after certain time
                Ext.defer(function() {
                    me.setDetailPushDisabled(false);
                }, 2000);
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
     * @param {Boolean} showLoadmask
     */
    _loadStore: function(showLoadmask) {
        if(showLoadmask) {
            this._showLoadMask();
        }
        // reset store and load first page
        this.getHighscoreStore().loadPage(1, {
            addRecords: false
        });
    },

    /**
     * @private
     */
    _showLoadMask: function() {
        this.getHighscoreRefreshButton().disable();
        this.getHighscoreNavigationView().setMasked({
            xtype: 'loadmask',
            message: Ext.i18n.Bundle.message('highscore.loadmask.message'),
            zIndex: Kort.util.Config.getZIndex().overlayLeafletMap
        });
    },

    /**
     * @private
     */
    _hideLoadMask: function() {
        this.getHighscoreNavigationView().setMasked(false);
        this.getHighscoreRefreshButton().enable();
    },

    /**
     * @private
     * @param {Kort.view.highscore.NavigationView} cmp
     * @param {Mixed} view
     * @param {Object} opts
     */
    _onHighscoreNavigationViewDetailPush: function(cmp, view, opts) {
        var me = this;
        me.getHighscoreRefreshButton().hide();
        // reenable detail push after certain time
        Ext.defer(function() {
            me.setDetailPushDisabled(false);
        }, 2000);
    },

    /**
     * @private
     * @param {Kort.view.highscore.NavigationView} cmp
     * @param {Mixed} view
     * @param {Object} opts
     */
    _onHighscoreNavigationViewBack: function(cmp, view, opts) {
        this.getHighscoreRefreshButton().show();
    }
});
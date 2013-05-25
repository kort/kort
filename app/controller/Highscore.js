/**
 * Controller for highscore tab and lists.
 */
Ext.define('Kort.controller.Highscore', {
    extend: 'Ext.app.Controller',
    
    config: {
        views: [
            'highscore.NavigationView',
            'highscore.AbsoluteList',
            'highscore.RelativeList',
            'highscore.user.Container'
        ],
        refs: {
            mainTabPanel: '#mainTabPanel',
            highscoreNavigationView: '#highscoreNavigationView',
            highscoreAbsoluteList: '#highScoreAbsoluteList',
            highscoreRelativeList: '#highScoreRelativeList',
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
            highscoreAbsoluteList: {
                itemtap: '_onHighscoreListItemTap'
            },
            highscoreRelativeList: {
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
        storesInLoadingState: []
    },

    /**
     * @private
     */
    init: function() {
        var me = this;
        me.callParent(arguments);
        me.getApplication().on({
            votesend: { fn: me._loadStores, scope: me },
            fixsend: { fn: me._loadStores, scope: me },
            userchange: { fn: me._loadStores, scope: me }
        });
    },


    /**
     * @private
     */
    _onHighscoreRefreshButtonTap: function() {
        this._loadStores();
    },

    /**
     * @private
     */
    _loadStores: function() {
        var me = this;
        me.getHighscoreRefreshButton().disable();
        me.getStoresInLoadingState().push(me.getHighscoreAbsoluteList());
        me.getStoresInLoadingState().push(me.getHighscoreRelativeList());

        me.getStoresInLoadingState().forEach(function(list, index, listArray) {
            me._showLoadMaskOnList(list);
            list.getStore().removeAll();
            list.getStore().loadPage(list.getPlugins()[0].getStartingPage(), {
                addRecords: true,
                callback: function(){me._hideLoadMaskOnList(list);},
                scope:me
            });
        });
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
     */
    _showLoadMaskOnList: function(list) {
        list.setMasked({
            xtype: 'loadmask',
            message: Ext.i18n.Bundle.message('highscore.loadmask.message'),
            zIndex: Kort.util.Config.getZIndex().overlayLeafletMap
        });
    },

    /**
     * @private
     */
    _hideLoadMaskOnList: function(list) {
        list.setMasked(false);
        this.getStoresInLoadingState().pop();
        if(!this.getStoresInLoadingState().lenth) {
            this.getHighscoreRefreshButton().enable();
        }
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
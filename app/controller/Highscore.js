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
            highscoreTabPanel: '#highscoreTabPanelId',
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
            votesend: { fn: function(){me._loadStores(true);}, scope: me },
            fixsend: { fn: function(){me._loadStores(true);}, scope: me },
            userchange: { fn: function(){me._loadStores(false);}, scope: me }
        });
    },

    /**
     * Refreshes all highscore lists from it's corresponding stores without update the stores itself (no ajax call).
     */
    refreshAllLists: function() {
        this.getHighscoreAbsoluteList().refresh();
        this.getHighscoreRelativeList().refresh();
    },


    /**
     * @private
     */
    _onHighscoreRefreshButtonTap: function() {
        this._loadStores(false);
    },

    /**
     * @private
     * Delegate the load store request to the lists underlying ListTwoWayPaging-Plugin. When a list has finished loading,
     * the _loadCallback function gets called (once for each list).
     */
    _loadStores: function(waitForUserRefreshedEvent) {
        var me = this;
        me.getHighscoreRefreshButton().disable();
        me.getStoresInLoadingState().push(me.getHighscoreAbsoluteList());
        me.getStoresInLoadingState().push(me.getHighscoreRelativeList());

        me.getStoresInLoadingState().forEach(function(list, index, listArray) {
            list.getStore().requestToWayUpdate(waitForUserRefreshedEvent,'_loadCallback',me);
        });

    },

    /**
     * @private
     * Callback function for the highscore list ListTwoWayPaging plugin. Gets called after a list has finished loading.
     * If a callback from the last loading list is received, reenables the loading button.
     */
    _loadCallback: function() {
        this.getStoresInLoadingState().pop();
        if(!this.getStoresInLoadingState().length) {
            this.getHighscoreRefreshButton().enable();
        }
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
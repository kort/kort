/**
 * A plugin for highscore data views that allows bidirectional traversals and userrelative starting points.
 */
Ext.define('Kort.plugin.ListTwoWayPaging', {
    extend: 'Ext.Component',
    alias: 'plugin.listtwowaypaging',

    config: {
        /**
         * @cfg {Boolean} bidirectional True to allow bidirectional page loading.
         */
        bidirectional: false,
        /**
         * @cfg {Number} offsetUntilLoading Pixels the scroller must be overpushed/overpulled to trigger page loading.
         */
        offsetUntilLoading: 30,
        /**
         * @cfg {Number} startingPage The pagenumber where the list should start.
         */
        startingPage: 1,
        /**
         * @cfg {Boolean} useUserPositionAsStartingPage True if the starting page should be calculated through the user's highscore position.
         */
        useUserPositionAsStartingPage: false,
        /**
         * @private
         */
        list: null,
        /**
         * @private
         */
        scroller: null,
        /**
         * @private
         */
        store: null,
        /**
         * @private
         */
        topPagePointer:null,
        /**
         * @private
         */
        bottomPagePointer:null,
        /**
         * @private
         */
        scrollEventLocked: false,
        /**
         * @private
         */
        topLoadTriggered: false,
        /**
         * @private
         */
        bottomLoadTriggered: false,
        /**
         * @private
         */
        loadMoreTopComponent: Ext.create('Ext.Component', {
            baseCls: 'x-list-paging x-loading',
            html:  ['<div class="x-loading-spinner" style="font-size: 180%; margin: 10px auto;">',
                '<span class="x-loading-top"></span>',
                '<span class="x-loading-right"></span>',
                '<span class="x-loading-bottom"></span>',
                '<span class="x-loading-left"></span>',
                '</div>'].join(''),
            scrollDock: 'top',
            docked: 'top',
            hidden: true
        }),
        /**
         * @private
         */
        loadMoreBottomComponent: Ext.create('Ext.Component', {
            baseCls: 'x-list-paging x-loading',
            html: ['<div class="x-loading-spinner" style="font-size: 180%; margin: 10px auto;">',
                '<span class="x-loading-top"></span>',
                '<span class="x-loading-right"></span>',
                '<span class="x-loading-bottom"></span>',
                '<span class="x-loading-left"></span>',
                '</div>'].join(''),
            scrollDock: 'bottom',
            docked: 'bottom',
            hidden: true
        }),
        /**
         * @private
         */
        updateCallbackFunctionName: null,
        /**
         * @private
         */
        updateCallbackScope:null
    },

    /**
     * @private
     * @param {Ext.List} listParam A higscore list.
     */
    init: function(listParam) {
        var me=this,
            list = listParam,
            scroller=list.getScrollable().getScroller(),
            store=list.getStore();

        list.setScrollToTopOnRefresh(false);
        me.setList(list);
        me.setScroller(scroller);
        me.setStore(store);
        me.setTopPagePointer(me.getStartingPage());
        me.setBottomPagePointer(me.getStartingPage());

        store.requestToWayUpdate=function(waitForUserRefreshedEvent,callbackFnName,callbackScope){
            me.setUpdateCallbackFunctionName(callbackFnName);
            me.setUpdateCallbackScope(callbackScope);
            if(!waitForUserRefreshedEvent || !me.getUseUserPositionAsStartingPage()){me._updateStore();}
        };

        list.on('initialize',me._onListInitialized,me);
        scroller.on('scroll',me._onScroll,me);
        scroller.on('scrollend',me._onScrollEnd,me);
        Kort.app.on('userloaded',me._updateStore,me);
        if(me.getUseUserPositionAsStartingPage()) {
            Kort.app.on('userrefreshed',me._updateStore,me);
        }
    },

    /**
     * @private
     */
    _updateStore: function() {
        var me =this;
        me._showLoadMask();
        me._resetPageCounters();
        me.getStore().removeAll();
        this.getStore().loadPage(me.getStartingPage(), {
            addRecords: true,
            callback: function(){me._storeUpdated();},
            scope:me
        });
    },

    /**
     * @private
     */
    _storeUpdated: function() {
        var callbackFunctionName=this.getUpdateCallbackFunctionName(),
            callbackScope=this.getUpdateCallbackScope();
        this.getList().refresh();
        this._hideLoadMask();
        if(callbackFunctionName && callbackScope) {
            this.setUpdateCallbackFunctionName(null);
            this.setUpdateCallbackScope(null);
            callbackScope[callbackFunctionName]();
        }
    },

    /**
     * @private
     */
    _showLoadMask: function() {
        this.getList().setMasked({
            xtype: 'loadmask',
            message: Ext.i18n.Bundle.message('highscore.loadmask.message'),
            zIndex: Kort.util.Config.getZIndex().overlayLeafletMap
        });
    },

    /**
     * @private
     */
    _hideLoadMask: function() {
        this.getList().setMasked(false);
    },

    /**
     * @private
     * @param {Ext.scroll.Scroller} scroller
     * @param {Number} x
     * @param {Number} y
     */
    _onScroll: function(scroller, x, y) {
        if(this.getBidirectional() && !this.getScrollEventLocked() && this.getTopPagePointer()>1 && y<-this.getOffsetUntilLoading()) {
            this.setScrollEventLocked(true);
            this.setTopLoadTriggered(true);
        }
        if(!this.getScrollEventLocked() && y>(scroller.getMaxPosition().y+this.getOffsetUntilLoading())) {
            this.setScrollEventLocked(true);
            this.setBottomLoadTriggered(true);
        }
    },

    /**
     * @private
     * @param {Ext.scroll.Scroller} scroller
     * @param {Number} x
     * @param {Number} y
     */
    _onScrollEnd: function(scroller, x, y) {
        if(this.getTopLoadTriggered()) {
            this.setTopLoadTriggered(false);
            this.setTopPagePointer(this.getTopPagePointer()-1);
            this._loadPreviousPage();
        }
        if(this.getBottomLoadTriggered()) {
            this.setBottomLoadTriggered(false);
            this.setBottomPagePointer(this.getBottomPagePointer()+1);
            this._loadNextPage();
        }
    },

    /**
     * @private
     */
    _onListInitialized: function() {
        if(this.getBidirectional()) {this.getList().add(this.getLoadMoreTopComponent());}
        this.getList().add(this.getLoadMoreBottomComponent());
    },

    /**
     * @private
     */
    _loadPreviousPage: function() {
        var me = this;
        if(me.getBidirectional()) {
            me.setScrollEventLocked(true);
            me.getLoadMoreTopComponent().show();
            me.getStore().loadPage(me.getTopPagePointer(),{
                addRecords: true,
                callback: function(){me._previousPageFinishedLoading();},
                scope:me
            });

        }
    },

    /**
     * @private
     */
    _loadNextPage: function() {
        var me = this;
        me.setScrollEventLocked(true);
        me.getLoadMoreBottomComponent().show();
        me.getStore().loadPage(me.getBottomPagePointer(),{
            addRecords: true,
            callback: function(){me._nextPageFinishedLoading();},
            scope:me
        });
    },

    /**
     * @private
     */
    _previousPageFinishedLoading: function() {
        this.setScrollEventLocked(false);
        this.getLoadMoreTopComponent().hide();
        this.getList().refresh();
    },

    /**
     * @private
     */
    _nextPageFinishedLoading: function() {
        this.setScrollEventLocked(false);
        this.getLoadMoreBottomComponent().hide();
    },

    /**
     * @private
     */
    _resetPageCounters: function() {
        if(this.getUseUserPositionAsStartingPage()) {this.setStartingPage(this._calculateStartingPageBasedOnUsersPosition());}
        this.setTopPagePointer(this.getStartingPage());
        this.setBottomPagePointer(this.getStartingPage());
    },

    /**
     * @private
     * @returns {Number}
     */
    _calculateStartingPageBasedOnUsersPosition: function() {
        try {
            return 1 + Math.floor((Kort.user.get('rownumber')-1)/this.getStore().getPageSize());
        }catch(err) {
            return this.getStartingPage();
        }
    }
});

Ext.define('Kort.plugin.ListTwoWayPaging', {
    extend: 'Ext.Component',
    alias: 'plugin.listtwowaypaging',

    config: {
        bidirectional: false,
        offsetUntilLoading: 30,
        startingPage: 1,
        useUserPositionAsStartingPage: false,

        list: null,
        scroller: null,
        store: null,

        topPagePointer:null,
        bottomPagePointer:null,

        scrollEventLocked: false,
        topLoadTriggered: false,
        bottomLoadTriggered: false,

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
        })

    },

    init: function(list) {
        var me=this,
            list = list,
            scroller=list.getScrollable().getScroller(),
            store=list.getStore();

        list.setScrollToTopOnRefresh(false);
        me.setList(list);
        me.setScroller(scroller);
        me.setStore(store);
        me.setTopPagePointer(me.getStartingPage());
        me.setBottomPagePointer(me.getStartingPage());

        store.on('clear',me._resetPageCounters,me);
        list.on('initialize',me._onListInitialized,me);
        scroller.on('scroll',me._onScroll,me);
        scroller.on('scrollend',me._onScrollEnd,me);

        if(me.getUseUserPositionAsStartingPage()) {
            Kort.app.on('userloaded',function() {
                me._resetPageCounters(false);
                store.loadPage(me.getStartingPage());
            });
        }
    },

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

    _loadPreviousPage: function() {
        var me = this;
        if(me.getBidirectional()) {
            me.setScrollEventLocked(true);
            me.getLoadMoreTopComponent().show();
            me.getStore().loadPage(me.getTopPagePointer(),{
                addRecords: true,
                callback: function(){me._previousPageFinishedLoading()},
                scope:me
            });

        }
    },

    _loadNextPage: function() {
        var me = this;
        me.setScrollEventLocked(true);
        me.getLoadMoreBottomComponent().show();
        me.getStore().loadPage(me.getBottomPagePointer(),{
            addRecords: true,
            callback: function(){me._nextPageFinishedLoading()},
            scope:me
        });
    },

    _onListInitialized: function() {
        if(!this.getUseUserPositionAsStartingPage()){this.getStore().loadPage(this.getStartingPage());}
        if(this.getBidirectional()) {this.getList().add(this.getLoadMoreTopComponent());}
        this.getList().add(this.getLoadMoreBottomComponent());
    },

    _previousPageFinishedLoading: function() {
        this.setScrollEventLocked(false);
        this.getLoadMoreTopComponent().hide();
        this.getList().refresh();
    },

    _nextPageFinishedLoading: function() {
        this.setScrollEventLocked(false);
        this.getLoadMoreBottomComponent().hide();
    },

    _resetPageCounters: function() {
        if(this.getUseUserPositionAsStartingPage()) {this.setStartingPage(this._calculateStartingPageBasedOnUsersPosition());}
        this.setTopPagePointer(this.getStartingPage());
        this.setBottomPagePointer(this.getStartingPage());
    },

    _calculateStartingPageBasedOnUsersPosition: function() {
        console.log(Kort.user.get('rownumber'));
        if(typeof(Kort.user.get('rownumber'))!=='undefined') {
            return 1 + Math.floor(Kort.user.get('rownumber')/this.getStore().getPageSize());
        }else {
            return this.getStartingPage();
        }
    }

})

Ext.define('Kort.controller.Profile', {
    extend: 'Ext.app.Controller',
    requires: [
        'Ext.LoadMask'
    ],
    
    config: {
        views: [
            'profile.Container',
            'profile.BadgesContainer'
        ],
        refs: {
            mainTabPanel: '#mainTabPanel',
            profileContainer: '#profileContainer',
            profileContentComponent: '.profilecontentcomponent',
            profileBadgesDataView: '.profilebadgesdataview',
            profileRefreshButton: '#profileContainer .button[cls=profileRefreshButton]',
            profileLogoutButton: '#profileContainer .button[cls=profileLogoutButton]',
            badgesContainerBackButton: '.badgescontainer .button[cls=badgesContainerBackButton]'
        },
        control: {
            profileContentComponent: {
                initialize: 'onProfileContentComponentInitialize'
            },
            profileBadgesDataView: {
                itemtap: 'onProfileBadgesDataViewItemTap'
            },
            profileRefreshButton: {
                tap: 'onProfileRefreshButtonTap'
            },
            profileLogoutButton: {
                tap: 'onProfileLogoutButtonTap'
            },
            badgesContainerBackButton: {
                tap: 'onBadgesContainerBackButtonTap'
            }
        },
        routes: {
            'profile': 'showProfile'
        },
        
        userStore: null,
        badgesContainer: null
    },
    
    showProfile: function() {
        this.getMainTabPanel().setActiveItem(this.getProfileContainer());
    },
    
    onProfileContentComponentInitialize: function() {
        var store = this.getUserStore(),
            user;
            
        if(!store.isLoaded()) {
            Ext.defer(this.onProfileContentComponentInitialize, 500, this);
        } else {
            user = this.getUserStore().first();
            this.getProfileContentComponent().setRecord(user);
        }
    },
    
    onProfileBadgesDataViewItemTap: function(dataViewCmp, index, target, record, e) {
        var badgesContainer = Ext.create('Kort.view.profile.BadgesContainer', {
            selectedBadgeIndex: index
        });
        this.setBadgesContainer(badgesContainer);
        Ext.Viewport.add(badgesContainer);
        badgesContainer.show();
    },
    
    onBadgesContainerBackButtonTap: function() {
        this.getBadgesContainer().hide();
    },
    
    onProfileLogoutButtonTap: function() {
        var me = this;
        me.showLoadMask(Ext.i18n.Bundle.message('profile.logout.loadmask.message'));
        Ext.Ajax.request({
            url: './server/webservices/user/logout',
            success: function(response){
                // reload current page
                window.location.reload();
            }
        });
    },
    
    onProfileRefreshButtonTap: function() {
        var me = this,
            userStore = Ext.getStore('User');
        
        me.showLoadMask(Ext.i18n.Bundle.message('profile.refresh.loadmask.message'));
        
        userStore.load(function() {
            var user = userStore.first(),
                userBadges = Ext.getStore('UserBadges');
                
            // loading badges of user
            userBadges.getProxy().setUrl('./server/webservices/user/' + user.get('id') + '/badges');
            userBadges.load();
            me.hideLoadMask();
        });
    },
    
    showLoadMask: function(message) {
        this.getProfileRefreshButton().disable();
        Ext.Viewport.setMasked({
            xtype: 'loadmask',
            message: message
        });
        
        Ext.defer(this.hideLoadMask, Kort.util.Config.getTimeout(), this);
    },
    
    hideLoadMask: function() {
        this.getProfileRefreshButton().enable();
        Ext.Viewport.setMasked(false);
    },
    
    init: function() {
        this.setUserStore(Ext.getStore('User'));
    }
});
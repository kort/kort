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
            logoutButton: '#logoutButton',
            badgesContainerBackButton: '.badgescontainer .button[cls=badgesContainerBackButton]',
            badgesCarousel: '.badgescontainer .badgescarousel'
        },
        control: {
            profileContentComponent: {
                initialize: 'onProfileContentComponentInitialize'
            },
            profileBadgesDataView: {
                itemtap: 'onProfileBadgesDataViewItemTap'
            },
            logoutButton: {
                tap: 'onLogoutButtonTap'
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
        var badgesContainer = Ext.create('Kort.view.profile.BadgesContainer');
        
        this.getBadgesCarousel().setActiveItem(index);
        this.setBadgesContainer(badgesContainer);
        Ext.Viewport.add(badgesContainer);
        badgesContainer.show();
    },
    
    onBadgesContainerBackButtonTap: function() {
        this.getBadgesContainer().hide();
    },
    
    onLogoutButtonTap: function() {
        var me = this;
        me.showLoadMask();
        Ext.Ajax.request({
            url: './server/webservices/user/logout',
            success: function(response){
                // reload current page
                window.location.reload();
            }
        });
    },
    
    showLoadMask: function() {
        Ext.Viewport.setMasked({
            xtype: 'loadmask',
            message: Ext.i18n.Bundle.message('profile.logout.loadmask.message')
        });
        
        Ext.defer(this.hideLoadMask, Kort.util.Config.getTimeout(), this);
    },
    
    hideLoadMask: function() {
        Ext.Viewport.setMasked(false);
        console.log('something went wrong');
    },
    
    init: function() {
        this.setUserStore(Ext.getStore('User'));
    }
});
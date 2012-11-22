Ext.define('Kort.controller.Profile', {
    extend: 'Ext.app.Controller',
    requires: [
        'Ext.LoadMask'
    ],
    
    config: {
        views: [
            'profile.Container'
        ],
        refs: {
            mainTabPanel: '#mainTabPanel',
            profileContainer: '#profileContainer',
            profileContentComponent: '#profileContentComponent',
            profileBadgesDataView: '#profileBadgesDataView',
            logoutButton: '#logoutButton'
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
            }
        },
        routes: {
            'profile': 'showProfile'
        },
        
        userStore: null
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
        console.log(record);
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
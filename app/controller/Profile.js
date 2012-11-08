Ext.define('Kort.controller.Profile', {
    extend: 'Ext.app.Controller',
    
    config: {
        views: [
            'profile.Container'
        ],
        refs: {
            mainTabPanel: '#mainTabPanel',
            profileContainer: '#profileContainer',
            profileContentContainer: '#profileContentContainer',
            logoutButton: '#logoutButton'
        },
        control: {
            profileContentContainer: {
                initialize: 'onProfileContentContrainerInitialize'
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
    
    onProfileContentContrainerInitialize: function() {
        var store = this.getUserStore(),
            user;
            
        if(!store.isLoaded()) {
            Ext.defer(this.onProfileContentContrainerInitialize, 500, this);
        } else {
            user = this.getUserStore().first();
            this.getProfileContentContainer().setRecord(user);
        }
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
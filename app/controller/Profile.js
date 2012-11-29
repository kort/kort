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

        badgesContainer: null
    },

    onProfileContentComponentInitialize: function() {
        if(!Kort.user) {
            Ext.defer(this.onProfileContentComponentInitialize, 500, this);
        } else {
            this.getProfileContentComponent().setRecord(Kort.user);
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
        var me = this,
            userLocalStore = Ext.getStore('UserLocal');

        me.showLoadMask(Ext.i18n.Bundle.message('profile.logout.loadmask.message'));
        Ext.Ajax.request({
            url: './server/webservices/user/' + Kort.user.get('id') + '/logout',
            success: function(response){
                userLocalStore.removeAll();
                
                // reload current page
                window.location.reload();
            }
        });
    },

    onProfileRefreshButtonTap: function() {
        var me = this;

        me.showLoadMask(Ext.i18n.Bundle.message('profile.refresh.loadmask.message'));
        
        Kort.model.User.reload(Kort.user, 'secret', me.hideLoadMask, me);
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
    }
});
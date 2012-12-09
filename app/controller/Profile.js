/**
 * Controller for profile tab
 */
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
    
    // @private
    init: function() {
        var me = this;
        me.callParent(arguments);
        
        me.getApplication().on({
            votesend: { fn: me.refreshProfile, scope: me },
            fixsend: { fn: me.refreshProfile, scope: me }
        });
    },

    // @private
    onProfileContentComponentInitialize: function() {
        if(!Kort.user) {
            Ext.defer(this.onProfileContentComponentInitialize, 500, this);
        } else {
            this.getProfileContentComponent().setRecord(Kort.user);
        }
    },

    // @private
    onProfileBadgesDataViewItemTap: function(dataViewCmp, index, target, record, e) {
        var badgesContainer = Ext.create('Kort.view.profile.BadgesContainer', {
            selectedBadgeIndex: index
        });
        this.setBadgesContainer(badgesContainer);
        Ext.Viewport.add(badgesContainer);
        badgesContainer.show();
    },

    // @private
    onBadgesContainerBackButtonTap: function() {
        this.getBadgesContainer().hide();
    },

    // @private
    onProfileLogoutButtonTap: function() {
        var me = this,
            userLocalStore = Ext.getStore('UserLocal');

        me.showLoadMask(Ext.i18n.Bundle.message('profile.logout.loadmask.message'));
        Ext.Ajax.request({
            url: Kort.util.Config.getWebservices().userLogout.getUrl(Kort.user.get('id')),
            success: function(response){
                userLocalStore.removeAll();
                
                // reload current page
                window.location.reload();
            }
        });
    },

    // @private
    onProfileRefreshButtonTap: function() {
        this.refreshProfile();
    },
    
    /**
     * @private
     * Refreshes user
     */
    refreshProfile: function() {
        var me = this;
        
        // show loadmask only if container is already loaded
        if(this.getProfileContainer()) {
            me.showLoadMask(Ext.i18n.Bundle.message('profile.refresh.loadmask.message'));
        }
        
        Kort.model.User.reload(Kort.user, 'secret', me.hideLoadMask, me);
    },

    // @private
    showLoadMask: function(message) {
        this.getProfileRefreshButton().disable();
        this.getProfileContainer().setMasked({
            xtype: 'loadmask',
            message: message
        });

        Ext.defer(this.hideLoadMask, Kort.util.Config.getTimeout(), this);
    },

    // @private
    hideLoadMask: function() {
        this.getProfileRefreshButton().enable();
        this.getProfileContainer().setMasked(false);
    }
});
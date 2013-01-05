/*jshint maxcomplexity:10 */

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
            profileSettingsButton: '#profileContainer .button[cls=profileSettingsButton]',
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
            profileSettingsButton: {
                tap: 'onProfileSettingsButtonTap'
            },
            profileLogoutButton: {
                tap: 'onProfileLogoutButtonTap'
            },
            badgesContainerBackButton: {
                tap: 'onBadgesContainerBackButtonTap'
            }
        },

        badgesContainer: null,
        itemTapDisabled: false
    },
    
    // @private
    init: function() {
        var me = this;
        me.callParent(arguments);
        
        me.getApplication().on({
            votesend: { fn: me.refreshProfile, scope: me },
            fixsend: { fn: me.refreshProfile, scope: me },
            userchange: { fn: me.refreshProfile, scope: me }
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
        var me = this,
            badgesContainer;

        if(!me.getItemTapDisabled()) {
            // disable fast tapping
            me.setItemTapDisabled(true);
            Ext.defer(function() {
                me.setItemTapDisabled(false);
            }, 1000);
            
            badgesContainer = Ext.create('Kort.view.profile.BadgesContainer', {
                selectedBadgeIndex: index
            });
            me.setBadgesContainer(badgesContainer);
            Ext.Viewport.add(badgesContainer);
            badgesContainer.show();
        }
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
    
    // @private
    onProfileSettingsButtonTap: function() {
        Ext.Msg.prompt(
            Ext.i18n.Bundle.message('profile.settings.messagebox.title'),
            Ext.i18n.Bundle.message('profile.settings.messagebox.message'),
            this.settingsSaveHandler,
            this,
            false,
            Kort.user.get('username'),
            {
                name: 'profileSettingsUsername'
            }
        );
    },
    
    /**
     * @private
     * Called when settings prompt gets closed
     */
    settingsSaveHandler: function(buttonId, value) {
        var me = this,
            messageBox;
            
        if(buttonId !== 'ok') {
            return;
        }
        if(value === '') {
            messageBox = Ext.create('Kort.view.NotificationMessageBox');
            messageBox.alert(Ext.i18n.Bundle.message('profile.alert.username.empty.title'), Ext.i18n.Bundle.message('profile.alert.username.empty.message'), Ext.emptyFn);
            return;
        }
        if(value.search(/^[a-zA-Z0-9]+$/) === -1) {
            messageBox = Ext.create('Kort.view.NotificationMessageBox');
            messageBox.alert(Ext.i18n.Bundle.message('profile.alert.username.specialchars.title'), Ext.i18n.Bundle.message('profile.alert.username.specialchars.message'), Ext.emptyFn);
            return;
        }
        
        // if username is different
        if(value !== Kort.user.get('username')) {
            Kort.user.set('username', value);
            me.showLoadMask(Ext.i18n.Bundle.message('profile.username.loadmask.message'));
            Kort.user.save({
                success: function() {
                    me.userSuccessfullSavedHandler();
                },
                failure: function() {
                    messageBox = Ext.create('Kort.view.NotificationMessageBox');
                    messageBox.alert(Ext.i18n.Bundle.message('profile.alert.submit.failure.title'), Ext.i18n.Bundle.message('profile.alert.submit.failure.message'), Ext.emptyFn);
                }
            }, me);
        }
    },
    
    /**
     * @private
     * Called when user was successfull saved
     */
    userSuccessfullSavedHandler: function(store, operation) {
        this.getApplication().fireEvent('userchange');
        this.hideLoadMask();
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
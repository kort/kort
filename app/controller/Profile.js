/*jshint maxcomplexity:10 */

/**
 * Controller for profile tab.
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
                initialize: '_onProfileContentComponentInitialize'
            },
            profileBadgesDataView: {
                itemtap: '_onProfileBadgesDataViewItemTap'
            },
            profileRefreshButton: {
                tap: '_onProfileRefreshButtonTap'
            },
            profileSettingsButton: {
                tap: '_onProfileSettingsButtonTap'
            },
            profileLogoutButton: {
                tap: '_onProfileLogoutButtonTap'
            },
            badgesContainerBackButton: {
                tap: '_onBadgesContainerBackButtonTap'
            }
        },
        /**
         * @private
         */
        badgesContainer: null,
        /**
         * @private
         */
        itemTapDisabled: false
    },

    /**
     * @private
     */
    init: function() {
        var me = this;
        me.callParent(arguments);
        me.getApplication().on({
            votesend: { fn: me._refreshProfile, scope: me },
            fixsend: { fn: me._refreshProfile, scope: me },
            userchange: { fn: me._refreshProfile, scope: me }
        });
    },

    /**
     * @private
     */
    _onProfileContentComponentInitialize: function() {
        if(!Kort.user) {
            Ext.defer(this._onProfileContentComponentInitialize, 500, this);
        } else {
            this.getProfileContentComponent().setRecord(Kort.user);
        }
    },

    /**
     * @private
     * Creates and displays a BadgesContainer for detailed information about the badge.
     * @param {Kort.view.profile.BadgesDataView} dataViewCmp
     * @param {Number} index
     * @param {Ext.dataview.component.DataItem} target
     * @param {Kort.model.Badge} record
     * @param {Ext.EventObject} e
     */
    _onProfileBadgesDataViewItemTap: function(dataViewCmp, index, target, record, e) {
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

    /**
     * @private
     */
    _onBadgesContainerBackButtonTap: function() {
        this.getBadgesContainer().hide();
    },

    /**
     * @private
     */
    _onProfileLogoutButtonTap: function() {
        var me = this,
            userLocalStore = Ext.getStore('UserLocal');

        me._showLoadMask(Ext.i18n.Bundle.message('profile.logout.loadmask.message'));
        Ext.Ajax.request({
            url: Kort.util.Config.getWebservices().userLogout.getUrl(Kort.user.get('id')),
            success: function(response){
                //ToDo doesnt work at all. Should remove only kort-user keys ant not newsItem-keys
                userLocalStore.removeAll();
                
                // reload current page
                window.location.reload();
            }
        });
    },

    /**
     * @private
     */
    _onProfileRefreshButtonTap: function() {
        this._refreshProfile();
    },

    /**
     * @private
     */
    _onProfileSettingsButtonTap: function() {
        Ext.Msg.prompt(
            Ext.i18n.Bundle.message('profile.settings.messagebox.title'),
            Ext.i18n.Bundle.message('profile.settings.messagebox.message'),
            this._settingsSaveHandler,
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
     * Called when settings prompt gets closed.
     */
    _settingsSaveHandler: function(buttonId, value) {
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
            me._showLoadMask(Ext.i18n.Bundle.message('profile.username.loadmask.message'));
            Kort.user.save({
                success: function() {
                    me._userSuccessfullSavedHandler();
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
     * Called when user was successfully saved.
     */
    _userSuccessfullSavedHandler: function() {
        this.getApplication().fireEvent('userchange');
        this._hideLoadMask();
    },
    
    /**
     * @private
     * Refreshes user.
     */
    _refreshProfile: function() {
        // show loadmask only if container is already loaded
        if(this.getProfileContainer()) {
            this._showLoadMask(Ext.i18n.Bundle.message('profile.refresh.loadmask.message'));
        }
        Kort.model.User.reload(Kort.user, 'secret', this._hideLoadMask, this);
    },

    /**
     * @private
     * @param {String} message
     */
    _showLoadMask: function(message) {
        this.getProfileRefreshButton().disable();
        this.getProfileContainer().setMasked({
            xtype: 'loadmask',
            message: message
        });
        Ext.defer(this._hideLoadMask, Kort.util.Config.getTimeout(), this);
    },

    /**
     * @private
     */
    _hideLoadMask: function() {
        this.getProfileRefreshButton().enable();
        this.getProfileContainer().setMasked(false);
    }
});
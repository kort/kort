/**
 * Controller for news tab.
 */
Ext.define('Kort.controller.News', {
    extend: 'Ext.app.Controller',

    config: {

        /**
         * @event newsupdated
         * Fired after news had been updated.
         */

        /**
         * @event newsacceptedlanguagesupdated
         * Fired after the news language settings had been changed.
         */
        views: [
            'news.NavigationView',
            'news.newsEntry.Container',
            'news.settings.AcceptedLanguagePanel'
        ],
        refs: {
            mainTabPanel: '#mainTabPanel',
            newsNavigationView: '#newsNavigationView',
            newsRefreshButton: '#newsNavigationView .button[cls=newsRefreshButton]',
            newsSettingsButton: '#newsNavigationView .button[cls=newsSettingsButton]',
            newsSettingsSaveButton: '#newsSettingsPanel .button[cls=newsSettingsSaveButton]',
            newsSettingsCancelButton: '#newsSettingsPanel .button[cls=newsSettingsCancelButton]',
            newsSettingsSelectAllLanguagesButton: '#newsSettingsPanel .button[cls=newsSettingsSelectAllLanguagesButton]',
            newsSettingsClearAllLanguagesButton: '#newsSettingsPanel .button[cls=newsSettingsClearAllLanguagesButton]',
            newsList: '.newslist'
        },
        control: {
            newsNavigationView: {
                push: '_onNewsNavigationViewDetailPush',
                back: '_onNewsNavigationViewBack'
            },
            newsRefreshButton: {
                tap: 'refreshNews'
            },
            newsSettingsButton: {
                tap: '_onNewsSettingsButtonTap'
            },
            newsSettingsSaveButton: {
                tap: '_onNewsSettingsSaveButton'
            },
            newsSettingsCancelButton: {
                tap: '_onNewsSettingsCancelButton'
            },
            newsSettingsSelectAllLanguagesButton: {
                tap: '_onNewsSettingsSelectAllLanguagesButton'
            },
            newsSettingsClearAllLanguagesButton: {
                tap: '_onNewsSettingsClearAllLanguagesButton'
            },
            newsList: {
                itemtap: '_onNewsListItemTap'
            }
        },
        /**
         * @private
         */
        detailPushDisabled: false,
        /**
         * @private
         */
        newsLocalStore:null,
        /**
         * @private
         */
        settingsPanel:null

    },

    /**
     * @private
     */
    init: function() {
        var me = this;
        this.setNewsLocalStore(Ext.getStore('NewsLocal'));
        this.getNewsLocalStore().on('updaterecord',me._newsLocalStoreUpdated,me);
        me.getApplication().on({
            geolocationready: { fn: me.refreshNews, scope: me }
        });
    },

    /**
     * Synchonizes news with atom feed defined in config file and stores them to the user's localstorage.
     */
    refreshNews: function() {
        var me = this;
        this.getNewsLocalStore().load({
            callback:me._syncLocalNewsStoreWithRemoteNewsStore,
            scope: me
        });
    },

    /**
     * @private
     * Sync news items from the news remote store, which is directly connected to the atom feed provided in the config file, with
     * the local storage. This allows to keep track of what articles the user has read.
     */
    _syncLocalNewsStoreWithRemoteNewsStore: function() {
        var me = this,
            newsRemoteStore = Ext.getStore('NewsRemote');
        newsRemoteStore.load({
            callback: function(records, operation, success) {
                //create new news items in local store
                records.forEach(function(element) {
                    if(me.getNewsLocalStore().findExact('newsid',element.data.newsid) === -1) {
                        //change model state to force sync to work properly
                        element.set('local',true);
                        me.getNewsLocalStore().add(element);
                    }
                });
                //delete obsolete news items form local store
                me.getNewsLocalStore().each(function(record) {
                    if(newsRemoteStore.findExact('newsid',record.get('newsid')) === -1) {
                        me.getNewsLocalStore().remove(record);
                    }
                });
                me.getNewsLocalStore().sync();
                me.getNewsLocalStore().load();
                me._newsLocalStoreUpdated();
            }
        });
    },

    /**
     * @private
     */
    _newsLocalStoreUpdated: function() {
        this.getApplication().fireEvent('newsupdated');
    },

    /**
     * @private
     * Displays news detail view for given news entry.
     * @param {Kort.view.news.List} list
     * @param {Number} index
     * @param {Ext.dataview.component.DataItem} target
     * @param {Kort.model.News} record
     * @param {Ext.EventObject} e
     */
    _onNewsListItemTap: function(list, index, target, record, e) {
        var me = this,
            newsNavigationView = me.getNewsNavigationView(),
            newsNewsEntryContainer;

        // disable fast tapping
        if(!me.getDetailPushDisabled()) {
            me.setDetailPushDisabled(true);

            newsNewsEntryContainer = Ext.create('Kort.view.news.newsEntry.Container', {
                record: record,
                title: Ext.i18n.Bundle.message('news.title')
            });

            // reenable detail push after certain time
            Ext.defer(function() {
                me.setDetailPushDisabled(false);
            }, 1000);

            newsNavigationView.push(newsNewsEntryContainer);
            record.set('unread',false);
            this.getNewsLocalStore().sync();
            this.getNewsLocalStore().load();
        }
    },

    /**
     * @private
     * Creates and displays the news language settings panel.
     */
    _onNewsSettingsButtonTap: function() {
        this.setSettingsPanel(Ext.create('Kort.view.news.settings.AcceptedLanguagePanel'));
        Ext.Viewport.add(this.getSettingsPanel());
        this.getSettingsPanel().show();
    },

    /**
     * @private
     * Store user made news settings to localstorage (via UserLocal store).
     */
    _onNewsSettingsSaveButton: function() {
        var settingsValues = this.getSettingsPanel().getValues(),
            newAcceptedLanguageArray = [],
            localUserStore = Ext.getStore('UserLocal');

        Kort.util.Config.getSupportedLanguages().forEach(function(element,index,array) {
            if(settingsValues[element]) {
                newAcceptedLanguageArray.push(element);
            }
        });

        localUserStore.getAt(0).set('newsAcceptedLanguageArray',newAcceptedLanguageArray);
        localUserStore.sync();
        this.getSettingsPanel().destroy();
        this.getNewsLocalStore().load();
        this.getApplication().fireEvent('newsacceptedlanguagesupdated');
    },

    /**
     * @private
     */
    _onNewsSettingsCancelButton: function() {
        this.getSettingsPanel().destroy();
    },

    /**
     * @private
     * Select all language checkboxes in news language settings panel.
     */
    _onNewsSettingsSelectAllLanguagesButton:function(){
        var fieldset = Ext.getCmp('acceptedLanguageFieldSet');
        fieldset.getItems().items.forEach(function(item) {
            item.setChecked(true);
        });
    },

    /**
     * @private
     * Deselect all language checkboxes in news language settings panel.
     */
    _onNewsSettingsClearAllLanguagesButton:function(){
        var fieldset = Ext.getCmp('acceptedLanguageFieldSet');
        fieldset.getItems().items.forEach(function(item) {
            item.setChecked(false);
        });
    },

    /**
     * @private
     */
    _onNewsNavigationViewDetailPush: function() {
        this.getNewsRefreshButton().hide();
        this.getNewsSettingsButton().hide();
    },

    /**
     * @private
     */
    _onNewsNavigationViewBack: function() {
        this.getNewsRefreshButton().show();
        this.getNewsSettingsButton().show();
    }
});

/**
 * Controller for news tab
 */
Ext.define('Kort.controller.News', {
    extend: 'Ext.app.Controller',

    config: {
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
                push: 'onNewsNavigationViewDetailPush',
                back: 'onNewsNavigationViewBack'
            },
            newsRefreshButton: {
                tap: 'refreshNews'
            },
            newsSettingsButton: {
                tap: 'onNewsSettingsButtonTap'
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
                itemtap: 'onNewsListItemTap'
            }

        },
        detailPushDisabled: false,
        newsLocalStore:null,
        settingsPanel:null

    },

    init: function() {
        var me = this;
        this.setNewsLocalStore(Ext.getStore('NewsLocal'));
        this.getNewsLocalStore().on('updaterecord',me.newsLocalStoreUpdated,me);
        me.getApplication().on({
            geolocationready: { fn: me.refreshNews, scope: me }
        });
    },

    refreshNews: function() {
        var me = this;
        this.getNewsLocalStore().load({
            callback:me.syncLocalNewsStoreWithRemoteNewsStore,
            scope: me
        });
    },

    syncLocalNewsStoreWithRemoteNewsStore: function() {
        var me = this;
        var newsRemoteStore = Ext.getStore('NewsRemote');
        newsRemoteStore.load({
            callback: function(records, operation, success) {
                //create new news items in local store
                records.forEach(function(element) {
                    if(me.getNewsLocalStore().findExact('newsid',element.data.newsid)==-1) {
                        //change model state to force sync to work properly
                        element.set('local',true);
                        me.getNewsLocalStore().add(element);
                    }
                });
                //delete obsolete news items form local store
                me.getNewsLocalStore().each(function(record) {
                    if(newsRemoteStore.findExact('newsid',record.get('newsid'))==-1) {
                        me.getNewsLocalStore().remove(record);
                    }
                });
                me.getNewsLocalStore().sync();
                me.getNewsLocalStore().load();
                me.newsLocalStoreUpdated();
            }
        });
    },

    newsLocalStoreUpdated: function() {
        this.getApplication().fireEvent('newsupdated');
    },

    onNewsListItemTap: function(list, index, target, record, e) {

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

    onNewsSettingsButtonTap: function() {
        this.setSettingsPanel(Ext.create('Kort.view.news.settings.AcceptedLanguagePanel'));
        Ext.Viewport.add(this.getSettingsPanel());
        this.getSettingsPanel().show();
    },

    _onNewsSettingsSaveButton: function() {
        var settingsValues = this.getSettingsPanel().getValues();
        var newAcceptedLanguageArray = [];
        Kort.util.Config.getSupportedLanguages().forEach(function(element,index,array) {
            if(settingsValues[element]) {
                newAcceptedLanguageArray.push(element);
            }
        });
        var localUserStore = Ext.getStore('UserLocal');
        localUserStore.getAt(0).set('newsAcceptedLanguageArray',newAcceptedLanguageArray);
        localUserStore.sync();
        this.getSettingsPanel().destroy();
        this.getNewsLocalStore().load();
        this.getApplication().fireEvent('newsacceptedlanguagesupdated');
    },

    _onNewsSettingsCancelButton: function() {
        this.getSettingsPanel().destroy();
    },
    // Select all languages
    _onNewsSettingsSelectAllLanguagesButton:function(){
        console.log('alles');
        var fieldset = Ext.getCmp('acceptedLanguageFieldSet');
        fieldset.getItems().items.forEach(function(item) {
            item.setChecked(true);
        });
    },
    //Deselect all languages
    _onNewsSettingsClearAllLanguagesButton:function(){
        console.log('nichts');
        var fieldset = Ext.getCmp('acceptedLanguageFieldSet');
        fieldset.getItems().items.forEach(function(item) {
            item.setChecked(false);
        });
    },

    onNewsNavigationViewDetailPush: function() {
        this.getNewsRefreshButton().hide();
        this.getNewsSettingsButton().hide();
    },

    onNewsNavigationViewBack: function() {
        this.getNewsRefreshButton().show();
        this.getNewsSettingsButton().show();
    }
});

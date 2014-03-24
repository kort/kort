/*
 This file is generated and updated by Sencha Cmd. You can edit this file as
 needed for your application, but these edits will have to be merged by
 Sencha Cmd when it performs code generation tasks such as generating new
 models, controllers or views and when running "sencha app upgrade".

 Ideally changes to this file would be limited and most work would be done
 in other places (such as Controllers). If Sencha Cmd cannot merge your
 changes and its generated code, it will produce a "merge conflict" that you
 will need to resolve manually.
 */

/**
 * @class Kort
 * Kort application.
 */
Ext.application({
    name: 'Kort',

    /**
     * @event geolocationready
     * Fired when gps data is available.
     * @param {Kort.util.Geolocation} geo Geolocation object.
     */

    /**
     * @event leafletmaprendered
     * Fired when tile leaflet map is rendered.
     */

    /**
     * @event fixsend
     * Fired when a fix was successfully submitted.
     */

    /**
     * @event votesend
     * Fired when a vote was successfully submitted.
     */


    /**
     * @event userloaded
     * Fired when a users data is correctly loaded.
     */

    /**
     * @event userrefreshed
     * Fired when a users data has been correctly refreshed.
     */

    /**
     * @event userchange
     * Fired when a change in the user's settings was successfully saved.
     */

    /**
     * @event maptypeupdaterequest
     * Fired to trigger update process of map abstract types (markers on leaflet map).
     */

    /**
     * @event newsupdated
     * Fired after the news local storage was successfuly synced with online atom feed.
     */

    /**
     * @event newsacceptedlanguagesupdated
     * Fired when a change in the news settings was successfully saved.
     */

    requires: [
        'patch.AjaxProxy',
        'Ext.MessageBox',
        'Ext.i18n.Bundle',
        'Kort.util.Config',
        'Kort.util.Geolocation',
        'Kort.plugin.QueryRouter'
    ],

    views: [
        'Main',
        'overlay.login.Panel',
        'overlay.geolocationerror.Panel',
        'overlay.firststeps.Panel'
    ],

    controllers: [
        'About',
        'Firststeps',
        'Fix',
        'GeolocationError',
        'Highscore',
        'Login',
        'Main',
        'Map',
        'MapMission',
        'MapValidation',
        'OsmMap',
        'Profile',
        'Vote',
        'News',
        'Notifications'
    ],

    models: [
        'Badge',
        'Mission',
        'Promotion',
        'Fix',
        'HighscoreEntry',
        'HighscoreUserBadge',
        'Reward',
        'SelectAnswer',
        'User',
        'UserBadge',
        'UserLocal',
        'Validation',
        'Vote',
        'News'
    ],

    stores: [
        'Missions',
        'Promotions',
        'HighscoreAbsolute',
        'HighscoreRelative',
        'HighscoreUserBadges',
        'SelectAnswers',
        'UserBadges',
        'UserLocal',
        'Validations',
        'NewsLocal',
        'NewsRemote'
    ],

    router: {
        xclass: 'Kort.plugin.QueryRouter'
    },

    statusBarStyle: 'black',

    icon: {
        57: './resources/images/kort-icon-57.png',
        72: './resources/images/kort-icon-72.png',
        114: './resources/images/kort-icon-114.png',
        144: './resources/images/kort-icon-144.png'
    },

    isIconPrecomposed: true,

    startupImage: {
        '320x460': './resources/images/kort-startup-320x460.png',
        '640x920': './resources/images/kort-startup-640x920.png',
        '768x1004': './resources/images/kort-startup-768x1004.png',
        '748x1024': './resources/images/kort-startup-748x1024.png',
        '1536x2008': './resources/images/kort-startup-1536x2008.png',
        '1496x2048': './resources/images/kort-startup-1496x2048.png'
    },

    // launch function is called as soon as app is ready
    launch: function() {
        var mainPanel;

        this.prepareI18n();
        this.prepareXTemplate();
        this.configureMessageBox();

        // create main panel
        // this has to be done in launch method so routes can work properly
        mainPanel = Ext.create('Kort.view.Main');
        Ext.Viewport.add(mainPanel);
        mainPanel.hide();

        this.loadGeolocation(mainPanel);
    },

    loadGeolocation: function(mainPanel) {
        var me = this;
        Kort.geolocation = Ext.create('Kort.util.Geolocation');
        Kort.geolocation.updateLocation(function(geo) {
            // Destroy the #appStartscreen element
            Ext.fly('appStartscreen').destroy();

            if(geo) {
                me.loadUserClientSecret(geo, mainPanel);
            } else {
                me.showGeolocationErrorOverlay();
            }
        });
    },

    loadUserClientSecret: function(geo, mainPanel) {
        var me = this,
            userLocalStore = Ext.getStore('UserLocal');

        userLocalStore.load(function(records, operation, success) {
            console.log('userLocalStore loaded');
            if(records.length === 0) {
                console.log('no client secret record found in localstorage');
                me.loadUser(geo, mainPanel);
            } else {
                console.log('client secret found in localstorage');
                me.loadUser(geo, mainPanel, records[0].get('secret'));
            }
        }, me);
    },

    loadUser: function(geo, mainPanel, clientSecret) {
        var me = this,
            userLocalStore = Ext.getStore('UserLocal');

        if(!clientSecret) {
            clientSecret = 0;
        }
        Kort.model.User.load(clientSecret, {
            success: function(record, operation) {
                // set global accessor to user
                Kort.user = record;
                // check if user is logged in
                if (!Kort.user.get('logged_in')) {
                    if(clientSecret && clientSecret !== 0) {
                        console.log('remove wrong client secret form local store');
                        userLocalStore.removeAll();
                    }
                    me.showLoginOverlay();
                } else {
                    if(!clientSecret) {
                        console.log('clientSecret not passed -> write client secret to localstore');
                        me.writeUserClientSecret(Kort.user.get('secret'));
                    }
                    me.loadStores(mainPanel, geo);
                    // enable auto update on geolocation
                    geo.setAutoUpdate(true);
                }
                me.fireEvent('userloaded');
            }
        });
    },

    writeUserClientSecret: function(clientSecret) {
        var userLocalStore = Ext.getStore('UserLocal'),
            userLocal;

        if(clientSecret) {
            console.log('writing userClientSecret to localstore');
            userLocal = Ext.create('Kort.model.UserLocal', { 'secret': clientSecret });
            userLocalStore.add(userLocal);
        } else {
            console.log('Error: no client secret passed');
        }
    },

    showLoginOverlay: function() {
        var loginPanel;

        console.log('user not logged in -> show login panel');
        loginPanel = Ext.create('Kort.view.overlay.login.Panel');
        Ext.Viewport.add(loginPanel);
        loginPanel.show();
    },

    showGeolocationErrorOverlay: function() {
        var geolocationerrorPanel;

        console.log('geolocation error');
        geolocationerrorPanel = Ext.create('Kort.view.overlay.geolocationerror.Panel');
        Ext.Viewport.add(geolocationerrorPanel);
        geolocationerrorPanel.show();
    },

    loadStores: function(mainPanel, geo) {
        var me = this,
            userBadges = Ext.getStore('UserBadges'),
            selectAnswersStore = Ext.getStore('SelectAnswers');

        // wait until correct position is found
        Ext.defer(me.fireEvent, 500, me, ['geolocationready', geo]);

        // load select answers
        selectAnswersStore.load();

        // load badges of user
        userBadges.getProxy().setUrl(Kort.util.Config.getWebservices().userBadges.getUrl(Kort.user.get('id')));
        userBadges.load();

        // show main panel
        this.showMainPanel(mainPanel);
    },

    showMainPanel: function(mainPanel) {
        mainPanel.show();

        if(!Kort.user.get('username')) {
            this.showFirstStepsPanel();
        }
    },

    showFirstStepsPanel: function() {
        var firststepsPanel = Ext.create('Kort.view.overlay.firststeps.Panel');
        console.log('no username given -> show first steps panel');
        Ext.Viewport.add(firststepsPanel);
        firststepsPanel.show();
    },

    prepareXTemplate: function() {
        // add method to use i18n strings with placeholders
        Ext.XTemplate.addMembers({
            getMessage: function(key, values) {
                return Ext.i18n.Bundle.message(key, values);
            }
        });
    },

    prepareI18n: function() {
        Ext.i18n.Bundle.configure({
            bundle: 'Kort',
            path: 'resources/i18n',
            language: Kort.util.Config.getLanguage(),
            noCache: true
        });
    },

    configureMessageBox: function() {
        // Override MessageBox default messages
    },

    onUpdated: function() {
        Kort.app.configureMessageBox();
        Kort.app.prepareI18n();

        Ext.Msg.defaultAllowedConfig.zIndex = Kort.util.Config.getZIndex().overlayOverlayPanel;
        Ext.Msg.confirm(
            Ext.i18n.Bundle.message('update.title'),
            Ext.i18n.Bundle.message('update.message'),
            function(buttonId) {
                if (buttonId === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});

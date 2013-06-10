//<debug>
Ext.Loader.setPath({
    'Ext': 'touch/src',
    'patch': 'patch',
    'Ext.i18n': 'i18n',
    'Ext.ux': 'ux',
    'Kort': 'app'
});
//</debug>

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

    icon: './resources/images/kort-icon.png',

    startupImage: {
        // Non-retina iPhone, iPod touch, and all Android devices
        '320x460': './resources/images/kort-startup-alldev-320x460.png',
        // Retina iPhone and iPod touch
        '640x920': './resources/images/kort-startup-alldev-640x920.png'
    },

    viewport: {
        // attempt to stop zooming when you double tap on the screen on mobile devices, typically HTC devices with HTC Sense UI
        preventZooming: true,
        // hide navigation bar of iOS browsers
        autoMaximize: (navigator.userAgent.search("Safari") !== -1 && navigator.userAgent.search("CriOS") === -1 && (!Ext.browser.is.Standalone && Ext.os.is.iOS && Ext.browser.version.isGreaterThan(3) ) ? true : false)
    },

    // launch function is called as soon as app is ready
    launch: function() {
        if(Kort.util.Config.isBrowserSupported()) {
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
        }
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
            //highscoreStore = Ext.getStore('Highscore');

        // wait until correct position is found
        Ext.defer(me.fireEvent, 500, me, ['geolocationready', geo]);

        // load select answers
        selectAnswersStore.load();

        // load badges of user
        userBadges.getProxy().setUrl(Kort.util.Config.getWebservices().userBadges.getUrl(Kort.user.get('id')));
        userBadges.load();
        
        // load highscore
        //highscoreStore.load();
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
        Ext.define('Kort.MessageBox', {
            override: 'Ext.MessageBox',

            statics: {
                YES   : {text: Ext.i18n.Bundle.message('messagebox.yes'),    itemId: 'yes', ui: 'action'},
                NO    : {text: Ext.i18n.Bundle.message('messagebox.no'),     itemId: 'no'},
                CANCEL: {text: Ext.i18n.Bundle.message('messagebox.cancel'), itemId: 'cancel'},

                OKCANCEL: [
                    {text: Ext.i18n.Bundle.message('messagebox.ok'), itemId: 'ok', ui: 'action'},
                    {text: Ext.i18n.Bundle.message('messagebox.cancel'), itemId: 'cancel'}
                ],
                YESNOCANCEL: [
                    {text: Ext.i18n.Bundle.message('messagebox.yes'),    itemId: 'yes', ui: 'action'},
                    {text: Ext.i18n.Bundle.message('messagebox.no'),     itemId: 'no'},
                    {text: Ext.i18n.Bundle.message('messagebox.cancel'), itemId: 'cancel'}
                ],
                YESNO: [
                    {text: Ext.i18n.Bundle.message('messagebox.yes'), itemId: 'yes', ui: 'action'},
                    {text: Ext.i18n.Bundle.message('messagebox.no'),  itemId: 'no'}
                ]
            }
        });
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

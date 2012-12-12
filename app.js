/*jshint maxcomplexity:10 */

//<debug>
Ext.Loader.setPath({
    'Ext': 'touch/src',
    'Ext.i18n': 'i18n',
    'Ext.ux': 'ux',
    'Kort': 'app'
});
//</debug>

Ext.application({
    name: 'Kort',

    requires: [
        'Ext.MessageBox',
        'Ext.i18n.Bundle',
        'Kort.util.Config',
        'Kort.util.Geolocation'
    ],
    
    views: [
        'Main',
        'overlay.login.Panel',
        'overlay.geolocationerror.Panel',
        'overlay.firststeps.Panel'
    ],

    controllers: [
        'About',
        'Bugmap',
        'Firststeps',
        'Fix',
        'GeolocationError',
        'Highscore',
        'Login',
        'Main',
        'OsmMap',
        'Profile',
        'Validation',
        'Vote'
    ],

    models: [
        'Badge',
        'Bug',
        'Fix',
        'HighscoreEntry',
        'Reward',
        'SelectAnswer',
        'User',
        'UserLocal',
        'Validation',
        'Vote'
    ],

    stores: [
        'Bugs',
        'Highscore',
        'SelectAnswers',
        'UserBadges',
        'UserLocal',
        'Validations'
    ],

    icon: './resources/images/kort-icon.png',

    startupImage: {
        // Non-retina iPhone, iPod touch, and all Android devices
        '320x460': './resources/images/kort-startup-320x460.jpg',
        // Retina iPhone and iPod touch
        '640x920': './resources/images/kort-startup-640x920.png'
    },

    viewport: {
        // hide navigation bar of browser
        autoMaximize: true
    },

    // launch function is called as soon as app is ready
    launch: function() {
        // Destroy the #appStartscreen element
        Ext.fly('appStartscreen').destroy();

        var selectAnswersStore = Ext.getStore('SelectAnswers'),
            mainPanel;

        this.prepareI18n();
        this.configureMessageBox();

        selectAnswersStore.load();

        // create main panel
        mainPanel = Ext.create('Kort.view.Main');
        Ext.Viewport.add(mainPanel);
        mainPanel.hide();

        // create ui
        this.loadGeolocation(mainPanel);
    },

    loadGeolocation: function(mainPanel) {
        var me = this;

        Kort.geolocation = Ext.create('Kort.util.Geolocation');
        Kort.geolocation.updateLocation(function(geo) {
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
                console.log('client secret found in localstorage: ' + records[0].get('secret'));
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

                console.log('user loaded');
                console.log(Kort.user);

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
                    me.showMainPanel(geo, mainPanel);
                }
            }
        });
    },

    writeUserClientSecret: function(clientSecret) {
        var userLocalStore = Ext.getStore('UserLocal'),
            userLocal;

        if(clientSecret) {
            console.log('writing userClientSecret to localstore: ' + clientSecret);
            userLocal = Ext.create('Kort.model.UserLocal', { 'secret': clientSecret });
            console.log(userLocal);
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

    showMainPanel: function(geo, mainPanel) {
        var validationsStore = Ext.getStore('Validations'),
            userBadges = Ext.getStore('UserBadges');

        mainPanel.show();

        validationsStore.getProxy().setUrl(Kort.util.Config.getWebservices().validation.getUrl(geo.getLatitude(), geo.getLongitude()));

        validationsStore.load(function(records, operation, success) {
            console.log('validationStores load');
            validationsStore.updateDistances(Kort.geolocation);
        }, this);
        // enable auto update on geolocation
        geo.setAutoUpdate(true);

        // loading badges of user
        userBadges.getProxy().setUrl(Kort.util.Config.getWebservices().userBadges.getUrl(Kort.user.get('id')));
        userBadges.load();

        // loading highscore
        Ext.getStore('Highscore').load();

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

    prepareI18n: function() {
        Ext.i18n.Bundle.configure({
            bundle: 'Kort',
            language: 'de-CH',
            path: 'resources/i18n',
            noCache: true
        });
    },

    configureMessageBox: function() {
        // Override MessageBox default messages
        Ext.override(Ext.MessageBox, {
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
        // Override MessageBox default messages
        Ext.override(Ext.MessageBox, {
            statics: {
                YES   : { text: 'Ja',   itemId: 'yes', ui: 'action'},
                NO    : { text: 'Nein', itemId: 'no'},

                YESNO: [
                    { text: 'Ja',   itemId: 'yes', ui: 'action'},
                    { text: 'Nein', itemId: 'no'}
                ]
            }
        });
        
        Ext.Msg.defaultAllowedConfig.zIndex = 1600;
        Ext.Msg.confirm(
            "Neue App-Version",
            "Die App wurde auf die neuste Version aktualisiert. App neu laden?",
            function(buttonId) {
                if (buttonId === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});

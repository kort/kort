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

    controllers: [
		'About',
		'Bugmap',
        'Firststeps',
		'Fix',
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
        'Validation',
        'Vote'
    ],

    stores: [
		'Bugs',
		'Highscore',
		'SelectAnswers',
        'User',
        'UserBadges',
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
        // TODO reenable autoMaximize (deactivated for iPhone simulator)
		autoMaximize: false
	},

    // launch function is called as soon as app is ready
    launch: function() {
        var selectAnswersStore = Ext.getStore('SelectAnswers');

        this.prepareI18n();
        this.configureMessageBox();

        selectAnswersStore.load();
        
        // create main panel
        var mainPanel = Ext.create('Kort.view.Main');
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
                me.loadUser(geo, mainPanel);
            } else {
                // TODO geolocation error panel
                console.log('geolocation must be available!');
            }
        });
    },
    
    loadUser: function(geo, mainPanel) {
        var me = this,
            userStore = Ext.getStore('User');
        
        userStore.load(function() {
            var user = userStore.first();
            
            // check if user is logged in
            if (!user.get('logged_in')) {
                me.showLoginOverlay();
            } else {
                me.showMainPanel(geo, user, mainPanel);
            }
        });
    },
    
    showLoginOverlay: function() {
        var loginPanel;
        
        console.log('user not logged in -> show login panel');
        loginPanel = Ext.create('Kort.view.overlay.login.Panel');
        Ext.Viewport.add(loginPanel);
        loginPanel.show();
    },
    
    showMainPanel: function(geo, user, mainPanel) {
        var validationsStore = Ext.getStore('Validations'),
            userBadges = Ext.getStore('UserBadges');
        
        mainPanel.show();
        
        // add locationupdate listener after store load
        validationsStore.on('load', function(store) {
            store.updateDistances(geo);
            geo.on('locationupdate', store.updateDistances(geo), store);
        }, this, { single: true });
        validationsStore.load();
        geo.setAutoUpdate(true);

        // loading badges of user
        userBadges.getProxy().setUrl('./server/webservices/user/' + user.get('id') + '/badges');
        userBadges.load();
        
        // loading highscore
        Ext.getStore('Highscore').load();

        if(!user.get('username')) {
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

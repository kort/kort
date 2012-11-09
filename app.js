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
        'Kort.util.Config'
    ],

    controllers: [
		'Bugmap',
        'Firststeps',
		'Fix',
		'Highscore',
        'Main',
        'Profile',
        'Verify',
        'Login'
	],

    models: [
		'Bug',
        'Fix',
        'User'
    ],

    stores: [
		'Bugs',
        'User'
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
        var userStore = Ext.getStore('User'),
            mainPanel;
        
        this.prepareI18n();
        this.configureMessageBox();
        
        // create main view
        mainPanel = Ext.create('Kort.view.Main');
        Ext.Viewport.add(mainPanel);
        
        // check if user is logged in
        userStore.load(function() {
            var user = userStore.first(),
                loginPanel,
                firststepsPanel;
            if (!user.get('loggedIn')) {
                console.log('user not logged in -> show login panel');
                mainPanel.hide();
                loginPanel = Ext.create('Kort.view.overlay.login.Panel');
                Ext.Viewport.add(loginPanel);
                loginPanel.show();
            } else if(!user.get('username')) {
                console.log('no username given -> show first steps panel');
                firststepsPanel = Ext.create('Kort.view.overlay.firststeps.Panel');
                Ext.Viewport.add(firststepsPanel);
                firststepsPanel.show();
            }
        });
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

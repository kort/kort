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
		autoMaximize: true
	},

    // launch function is called as soon as app is ready
    launch: function() {
        this.prepareI18n();
        this.configureMessageBox();

        Ext.Viewport.add(Ext.create('Kort.view.Main'));

        var userStore = Ext.getStore('User');
        userStore.load(function() {
            var user = userStore.first();
            if (!user.get('loggedIn')) {
                Ext.Viewport.add(Ext.create('Kort.view.login.Sheet'));
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

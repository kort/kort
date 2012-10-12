//<debug>
Ext.Loader.setPath({
    'Ext': 'touch/src',
    'Kort': 'app'
});
//</debug>

Ext.override(Ext.MessageBox, {
	statics: {
        YES   : {text: 'Ja',    itemId: 'yes', ui: 'action'},
        NO    : {text: 'Nein',     itemId: 'no'},
        CANCEL: {text: 'Abbrechen', itemId: 'cancel'},

        OKCANCEL: [
            {text: 'Abbrechen', itemId: 'cancel'},
        ],
        YESNOCANCEL: [
            {text: 'Abbrechen', itemId: 'cancel'},
            {text: 'Nein',     itemId: 'no'},
            {text: 'Ja',    itemId: 'yes', ui: 'action'}
        ],
        YESNO: [
            {text: 'Ja', itemId: 'yes', ui: 'action'},
			{text: 'Nein',  itemId: 'no'}
        ]
    }
});

Ext.application({
    name: 'Kort',

    requires: [
        'Ext.MessageBox',
        'Ext.i18n.Bundle'
    ],

   views: [
		'Main'
	],
    
    controllers: [
		'Map'
	],
    
    models: [
		'Bug'
    ],
	
    stores: [
		'Bugs'
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
        Ext.i18n.Bundle.configure({
			bundle: 'Kort',
			language: 'de-CH',
			path: 'resources/i18n',
			noCache: true
  		});
        
		Ext.getStore('Bugs').load(function(records, operation, success) {
            Ext.Viewport.add(Ext.create('Kort.view.Main'));
        });
    },

    onUpdated: function() {
        Ext.Msg.confirm(
            "Application Update",
            "This application has just successfully been updated to the latest version. Reload now?",
            function(buttonId) {
                if (buttonId === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});

// enable Ext autoloader
Ext.Loader.setConfig({
	enabled: true
});

Ext.application({
    name: 'Kort',
    
    icon: './resources/images/kort-icon.png',
	startupImage: {
		// Non-retina iPhone, iPod touch, and all Android devices
		'320x460': './resources/images/kort-startup-320x460.jpg',
		// Retina iPhone and iPod touch
		'640x920': './resources/images/kort-startup-640x920.png'
	},
	statusBarStyle: 'black',
	viewport: {
		// hide navigation bar of browser
		autoMaximize: true
	},
    
	requires: ['Ext.i18n.Bundle'],
    
	views: [
		'Main'
	],
    
    controllers: [
		'Map'
	],
    
	// launch function is called as soon as app is ready
	launch: function() {
  		Ext.i18n.Bundle.configure({
			bundle: 'Kort',
			language: 'de-CH',
			path: 'resources/i18n',
			noCache: true
  		});

        Ext.Viewport.add(Ext.create('Kort.view.Main'));
	}
});

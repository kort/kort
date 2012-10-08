// enable Ext autoloader
Ext.Loader.setConfig({
	enabled: true
});

Ext.application({
    name: 'OpenLayersApp',
    
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

        Ext.Viewport.add(Ext.create('OpenLayersApp.view.Main'));
	}
});

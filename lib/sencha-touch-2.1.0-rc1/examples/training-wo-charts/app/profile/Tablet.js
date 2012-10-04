Ext.define('CrimeFinder.profile.Tablet', {
    extend: 'Ext.app.Profile',
    config: {
       name: 'Tablet',
       views: ['Main'],
       controllers: ['Main']
    },
    isActive: function() {
        return Ext.os.is.Tablet || Ext.os.is.Desktop;
    },
    launch: function() {
 	  Ext.Viewport.add(
 		Ext.create('CrimeFinder.view.tablet.Main')
 	  );
    }
});
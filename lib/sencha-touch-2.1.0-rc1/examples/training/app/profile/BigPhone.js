Ext.define('CrimeFinder.profile.BigPhone', {
    extend: 'Ext.app.Profile',

    config: {
    	name: 'BigPhone',
    	views: ['Main'],
    	controllers: ['Main']
    },
    
    isActive: function() {
    	 
      	 return location.search.indexOf('BigPhone') > 0 || (Ext.os.is.Phone && (Ext.os.is('Android') || Ext.browser.is.Standalone));
    },
    
    launch: function() {
 		Ext.Viewport.add(
 		   Ext.create('CrimeFinder.view.bigphone.Main')
 		);
    }
});
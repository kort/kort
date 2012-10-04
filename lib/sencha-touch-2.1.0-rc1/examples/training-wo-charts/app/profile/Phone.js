Ext.define('CrimeFinder.profile.Phone', {
    extend: 'Ext.app.Profile',

    config: {
    		name: 'Phone',
    		views: ['Main'],
    		controllers: ['Main']
    },
    
    isActive: function() {
      	 return Ext.os.is.Phone
    },
    
    launch: function() {
 		Ext.Viewport.add(
 		   Ext.create('CrimeFinder.view.phone.Main')
 		);
    }
});
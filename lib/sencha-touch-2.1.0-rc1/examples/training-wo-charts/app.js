
Ext.Loader.setConfig({
   paths: {
   	 'Ext.device' : '../../src/device'
   }
});

Ext.application({
	name : 'CrimeFinder',
	
	requires: ['CrimeFinder.store.Statistics', 'CrimeFinder.config.Constants'],
	stores : ['Statistics','Confessions','CrimeReports', 'FbiRssItems', 'MostWanteds', 'NewsMenuItems',  'MenuOptions'],
	controllers: ['CrimeReports','News','Confess','MostWanteds'],
	
	profiles: ['BigPhone','Phone','Tablet'],
	
	phoneIcon: '../../images/cf_phone_icon.png',
	phoneStartupScreen: '../../images/cf_phone_startup.png',
	tabletIcon: '../../images/cf_tablet_icon.png',
	tabletStartupScreen: '../../images/cf_tablet_startup.png',
	
	
	launch : function() {
		Ext.get('loading').setVisible(false);
	}
});

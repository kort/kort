Ext.define("CrimeFinder.config.Constants", {

	statics: {
		
		webserviceUrl: 'http://www.senchatouchtraining.com/ftst2/components/crimeservice.cfc',
		fbiRssUrl: 'http://www.senchatouchtraining.com/ftst2/components/crimeservice.cfc?method=getFBIRSSjsonp&feedurl=',
		offenses: [{
					text : 'Jaywalking',
					value : 1
				}, {
					text : 'Littering',
					value : 2
				}, {
					text : 'Speeding',
					value : 3
		}]
		
	}
	
	
})
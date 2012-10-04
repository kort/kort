Ext.define("CrimeFinder.model.FbiRssItem", {
	extend : 'Ext.data.Model',
	config : {
		fields : [
			'TITLE', 'FIRSTNAME', 'LASTNAME','DESCRIPTION', 'PHOTO'
		],
		proxy : {
			type : 'jsonp',
			url : CrimeFinder.config.Constants.webserviceUrl + '?method=getFBIRSSjsonp'
		}
	}
});

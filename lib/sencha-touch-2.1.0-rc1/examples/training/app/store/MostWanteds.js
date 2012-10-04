Ext.define("CrimeFinder.store.MostWanteds", {
	extend : 'Ext.data.TreeStore',
	requires: ['CrimeFinder.model.MostWanted'],
	config : {
		model : 'CrimeFinder.model.MostWanted',
		root : {},
		proxy : {
			type : 'jsonp',
			url : CrimeFinder.config.Constants.webserviceUrl + '?method=getTopTenJsonP'
		},
		autoLoad : false
	}
});
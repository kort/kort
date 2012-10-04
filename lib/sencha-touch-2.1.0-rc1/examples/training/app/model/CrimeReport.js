Ext.define("CrimeFinder.model.CrimeReport", {
	extend : 'Ext.data.Model',
	config : {
		fields : [
		{
			name : 'REPORTDATE',
			type : 'date',
			format : 'm/d/Y'
		}, 
		'OFFENSE', 
		'ADDRESS', 
		'DESCRIPTION',
		'LAT', 
		'LNG'
	   ],

		proxy : {
			type : 'jsonp',
			url : CrimeFinder.config.Constants.webserviceUrl + '?method=crimesearchjsonp'
		}
	}

});

Ext.define("CrimeFinder.model.Statistic", {
	extend : 'Ext.data.Model',
	config : {
		idProperty : 'idcrimereport',
		fields : [
		  {
			name : "count",
			type : 'int'
		  }, 
		  "label"
		]
	}
});

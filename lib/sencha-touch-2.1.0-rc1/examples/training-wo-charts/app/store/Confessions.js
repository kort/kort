Ext.define("CrimeFinder.store.Confessions", {
	extend : 'Ext.data.Store',
	requires: ['CrimeFinder.model.Confession'],
	config : {
		model : 'CrimeFinder.model.Confession',
		remoteFilter : true,
		remoteSort : true,
		pageSize: 5,
		autoLoad : true,
		sorters : [{
			property : 'idcrimereport',
			direction : 'DESC'
		}]
	}
});

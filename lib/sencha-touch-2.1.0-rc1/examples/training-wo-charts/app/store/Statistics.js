Ext.define("CrimeFinder.store.Statistics", {
	extend : 'Ext.data.Store',
	requires: ['CrimeFinder.model.Statistic'],
	config : {
		model : 'CrimeFinder.model.Statistic'
	}
});
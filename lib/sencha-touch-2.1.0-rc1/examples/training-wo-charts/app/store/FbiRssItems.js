Ext.define("CrimeFinder.store.FbiRssItems", {
  extend : 'Ext.data.Store',
  requires: ['CrimeFinder.model.FbiRssItem'],
  config : {
	model : 'CrimeFinder.model.FbiRssItem',
	sorters : 'LASTNAME',
	grouper : {
	  groupFn: function(record) {
		return record.get('LASTNAME')[0];
	  }
	},
	autoLoad : false
  }
});

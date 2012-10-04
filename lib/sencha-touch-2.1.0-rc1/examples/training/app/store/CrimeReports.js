Ext.define("CrimeFinder.store.CrimeReports", {
	extend : 'Ext.data.Store',
	requires: ['CrimeFinder.model.CrimeReport', 'CrimeFinder.store.Statistics'],
	config : {
	  model : 'CrimeFinder.model.CrimeReport',
	  countStore: Ext.create('CrimeFinder.store.Statistics'),
	  remoteFilter : true,
	  remoteSort : false,
	  autoLoad : false,
	  groupField: 'OFFENSE',
	  sorters : [{
		property : 'OFFENSE',
		direction : 'ASC'
	  }],

	  /* recalc stats on load */
      listeners: {
        load: { 
          fn: function(objStore, aRecords, bSuccess){
            this.calcCount();
          }
        }
      }
	 },
	    
    /* generate count(*) statistics */
    calcCount: function(){
      var aGroups = this.getGroups();
      var aResult = [];
      var countStore = this.getCountStore();
      countStore.removeAll();
      for (var i = 0; i < aGroups.length; i++) 
      {
          countStore.add({
         	 label: aGroups[i].name,
         	 count: aGroups[i].children.length
           });
      }
    }
});

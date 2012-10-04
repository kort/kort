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
		}],
		
		changeLocale: function(locale) {
			var xtypes = ["confessform"];
			var aInstances=[];
			var parent = null;
			var initialConfig = null;
			Ext.Ajax.request({
				url : 'app/locale/confess_' + locale + '.js',
				success : function(response, opts) {
					eval(response.responseText);
					Ext.Msg.alert("Language Change", "Locale changed");
					for (var i=0; i<xtypes.length; i++) {
						aInstances = Ext.ComponentQuery.query(xtypes[i]);
						for (var j=0; j<aInstances.length; j++) {
							initialConfig = aInstances[i].initialConfig;
							parent = aInstances[i].up('container');
							for (var k=0; k<parent.getItems().items.length; k++) {
								if (parent.getItems().items[k].id == aInstances[i].id) {
									aInstances[i].destroy();
									parent.add(initialConfig);
									break;
								}
							}
						}
					}
				},
				failure : function() {
					Ext.Msg.alert("Failed to load Locale file");
				},
				scope : this
			});
		}
		
	}
	
	
})
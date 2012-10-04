Ext.define("CrimeFinder.store.MenuOptions", {
	extend : 'Ext.data.Store',
	requires: ['CrimeFinder.model.MenuOption'],
	config : {
		model : 'CrimeFinder.model.MenuOption',
		data: [
		  { iconCls: 'calendar2', title: 'Historical Activity', route: 'historicalactivity'},
		  { iconCls: 'bullseye2', title: 'Wanted by FBI', route: 'wantedbyfbi'},
		  { iconCls: 'cloud_bolt', title: 'Recent Activity', route: 'recentactivity'},
		  { iconCls: 'globe2', title: 'Missing Persons', route: 'missingpersons'},
		  { iconCls: 'nuclear', title: 'Domestic Terrorists', route: 'domesticterrorists'},
		  { iconCls: 'team', title: 'Cyber Criminals', route: 'cybercriminals'},
		  { iconCls: 'tv', title: 'Video', route: 'video'},
		  { iconCls: 'podcast', title: 'Podcast', route: 'podcast'},
		  { iconCls: 'user_add', title: 'Confess!', route: 'confess'}
		]
	}
});
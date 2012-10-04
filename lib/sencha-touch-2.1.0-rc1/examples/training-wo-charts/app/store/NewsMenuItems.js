Ext.define("CrimeFinder.store.NewsMenuItems", {
	extend : 'Ext.data.Store',
	requires: ['CrimeFinder.model.NewsMenuItem'],
	config : {
		model : 'CrimeFinder.model.NewsMenuItem',
		data : [ 
		{
			label: 'Latest Reports!',
			id: 0
		},
		{
			label : 'Missing Persons',
			id : 1,
			store: 'FbiRssItems',
			view: 'fbipersons',
			url: 'http://www.fbi.gov/wanted/kidnap/wanted-feed.xml'
		},
		{
			label: 'Domestic Terrorists',
			id: 2,
			store: 'FbiRssItems',
			view: 'fbipersons',
			url: 'http://www.fbi.gov/wanted/dt/wanted-feed.xml'
		},
		{
			label: 'Cyber Crimes',
			id: 3,
			store: 'FbiRssItems',
			view: 'fbipersons',
			url: 'http://www.fbi.gov/wanted/cyber/wanted-feed.xml'
		}
	  ]
	}
});
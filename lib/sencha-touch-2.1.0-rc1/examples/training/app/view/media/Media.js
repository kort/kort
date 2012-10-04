Ext.define("CrimeFinder.view.media.Media", {
	extend : 'Ext.carousel.Carousel',
	xtype : 'crimefindermedia',
	requires : ['CrimeFinder.view.media.Video', 'CrimeFinder.view.media.Audio'],
	config : {
		direction : 'horizontal',
		indicator : false,
		items : [
		{
			xtype : 'crimefindervideo'

		}, {
			xtype: 'container',
			layout: 'fit',
			items: [
			  {
				xtype : 'titlebar',
				docked : 'top',
				title : 'FBI Podcast'
			  },
			  {
				xtype : 'crimefinderaudio'
			  }
			]
		}]
	}
});

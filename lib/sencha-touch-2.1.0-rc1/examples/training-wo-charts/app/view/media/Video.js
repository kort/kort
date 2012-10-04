
Ext.define("CrimeFinder.view.media.Video", {
	extend: 'Ext.Container',
	xtype: 'crimefindervideo',
	requires: ['Ext.Video', 'Ext.TitleBar'],
	config: {
		layout : 'fit',
		items : [{
				xtype : 'titlebar',
				docked : 'top',
				title : 'Accident on GW Parkway'
			}, {
				xtype : 'video',
				url : 'http://senchatraining.com/ftst2assets/accident.m4v',
				posterUrl : 'http://senchatraining.com/ftst2assets/poster1.png',
				loop : true
		}]
	}
})
Ext.define("CrimeFinder.view.media.Audio", {
	extend : 'Ext.Container',
	xtype : 'crimefinderaudio',
	requires : ['Ext.Img', 'Ext.Audio', 'Ext.TitleBar'],
	config : {
		layout : {
			type : 'vbox',
			pack : 'center',
			align : 'center'
		},

		items : [{
			xtype : 'image',
			src : "resources/images/fbi.jpg",
			width : 353,
			height : 206
		}, {

			xtype : 'audio',
			url : 'http://senchatraining.com/ftst2assets/podcast.mp3',
			width : 353
		}]
	}
});
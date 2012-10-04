Ext.define('Oreilly.view.speaker.Card', {

	extend: 'Ext.NavigationView',
	xtype: 'speakerContainer',

	config: {

        tab: {
			title: 'Speakers',
	        iconCls: 'team1',
	        action: 'speakersTab'
	    },

        autoDestroy: false,

		items: [
			{
				xtype: 'speakers',
				store: 'Speakers',
				grouped: true,
				pinHeaders: false,
				indexBar: true
			}
		]
	}
});

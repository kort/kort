Ext.define('Oreilly.view.speaker.Detail', {

	extend: 'Ext.Container',
	xtype: 'speaker',

	config: {

		layout: 'vbox',
		items: [
			{
                flex: 1,
                scrollable: 'vertical',
				xtype: 'speakerInfo'
			},
			{
                flex: 2,
				xtype: 'list',
				store: 'SpeakerSessions',
				items: [
					{
						xtype: 'listitemheader',
						cls: 'dark',
						html: 'Sessions'
					}
				],
				itemTpl: [
					'{title}'
				]
			}
		]

	}
});

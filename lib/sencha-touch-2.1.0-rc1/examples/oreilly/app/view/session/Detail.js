Ext.define('Oreilly.view.session.Detail', {

	extend: 'Ext.Container',
	xtype: 'session',

	config: {

		layout: 'vbox',
		title: '',

		items: [
			{
                flex: 1,
                layout: 'fit',
                scrollable: 'vertical',
				xtype: 'sessionInfo'
			},
			{
                flex: 2,
				xtype: 'speakers',
				store: 'SessionSpeakers',
				items: [
					{
						xtype: 'listitemheader',
						cls: 'dark',
						html: 'Speakers'
					}
				]
			}
		]

	}
});

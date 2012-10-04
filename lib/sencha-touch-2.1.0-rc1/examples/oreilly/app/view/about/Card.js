Ext.define('Oreilly.view.about.Card', {

	extend: 'Ext.NavigationView',
	xtype: 'aboutContainer',

	config: {

		title: 'About',
        iconCls: 'time',

        autoDestroy: false,

		items: [
			{
				xtype: 'aboutList'
			}
		]
	}
});

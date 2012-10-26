Ext.define('Kort.view.verify.Container', {
	extend: 'Ext.Container',
	alias: 'widget.verifycontainer',
    requires: [
        'Ext.TitleBar'
    ],
	
	config: {
		title: Ext.i18n.Bundle.message('tab.verify'),
		url: 'verify',
		id: 'verifyContainer',
		iconCls: 'check_black2',
		layout: 'fit',
		items: [
			{
				xtype: 'titlebar',
				cls: 'titlebar',
				docked: 'top',
				title: Ext.i18n.Bundle.message('verify.title')
			},
			{
                html: 'Hier kommt eine Liste'
			}
		]
	}
});
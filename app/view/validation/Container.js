Ext.define('Kort.view.validation.Container', {
	extend: 'Ext.Container',
	alias: 'widget.validationcontainer',
    requires: [
        'Ext.TitleBar'
    ],
	
	config: {
		title: Ext.i18n.Bundle.message('tab.validation'),
		url: 'validation',
		id: 'validationContainer',
		iconCls: 'check_black2',
		layout: 'fit',
		items: [
			{
				xtype: 'titlebar',
				cls: 'titlebar',
				docked: 'top',
				title: Ext.i18n.Bundle.message('validation.title')
			},
			{
                html: 'Hier kommt eine Liste'
			}
		]
	}
});
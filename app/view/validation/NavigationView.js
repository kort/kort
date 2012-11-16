Ext.define('Kort.view.validation.NavigationView', {
	extend: 'Ext.navigation.View',
	alias: 'widget.validationnavigationview',
    requires: [
        'Ext.Button',
        'Kort.view.validation.List'
    ],
	
	config: {
        title: Ext.i18n.Bundle.message('tab.validation'),
		url: 'validation',
		id: 'validationNavigationView',
		iconCls: 'check_black2',
        defaultBackButtonText: Ext.i18n.Bundle.message('button.back'),
        
		items: [
			{
                title: Ext.i18n.Bundle.message('validation.title'),
                xtype: 'validationlist'
			}
		]
	}
});
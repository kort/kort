/**
 * Main navigation view for validation tab
 */
Ext.define('Kort.view.validation.NavigationView', {
	extend: 'Ext.navigation.View',
	alias: 'widget.validationnavigationview',
    requires: [
        'Ext.Button',
        'Kort.view.validation.Container'
    ],
	
	config: {
        title: Ext.i18n.Bundle.message('tab.validation'),
		url: 'validation',
		id: 'validationNavigationView',
		iconCls: 'check_black2',
        defaultBackButtonText: Ext.i18n.Bundle.message('button.back'),
        
        navigationBar: {
            items: [
                {
                    xtype: 'segmentedbutton',
                    items: [
                        {
                            itemId: 'list',
                            iconCls: 'list',
                            iconMask: true,
                            pressed: true
                        },
                        {
                            itemId: 'map',
                            iconCls: 'maps',
                            iconMask: true
                        }
                    ],
                    align: 'left'
                },
                {
                    xtype: 'button',
                    cls: 'validationMapCenterButton',
                    iconCls: 'locate',
                    iconMask: true,
                    align: 'left',
                    hidden: true
                },
                {
                    xtype: 'button',
                    cls: 'validationRefreshButton',
                    iconCls: 'refresh',
                    iconMask: true,
                    align: 'right'
                }
            ],
            // SENCAH TOUCH BUGFIX:
            // disable navigationBar animation because of wrong title positioning
            animation: false
        },
        
		items: [
			{
                title: Ext.i18n.Bundle.message('validation.title'),
                xtype: 'validationcontainer'
			}
		]
	}
});
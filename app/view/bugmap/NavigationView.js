/**
 * Main navigation view for bugmap tab
 */
Ext.define('Kort.view.bugmap.NavigationView', {
	extend: 'Ext.navigation.View',
	alias: 'widget.bugmapnavigationview',
    requires: [
        'Kort.view.LeafletMap',
        'Ext.Button'
    ],
	
	config: {
        title: Ext.i18n.Bundle.message('tab.bugmap'),
		url: 'bugmap',
		id: 'bugmapNavigationView',
		iconCls: 'maps',
        defaultBackButtonText: Ext.i18n.Bundle.message('button.back'),
        
        navigationBar: {
            items: [
                {
                    xtype: 'button',
                    cls: 'bugmapCenterButton',
                    iconCls: 'locate',
                    iconMask: true,
                    align: 'left'
                },
                {
                    xtype: 'button',
                    cls: 'bugmapRefreshButton',
                    iconCls: 'refresh',
                    iconMask: true,
                    align: 'right'
                }
            ]
        },
		items: [
			{
                title: Ext.i18n.Bundle.message('bugmap.title'),
                
                xtype: 'kortleafletmap',
                id: 'bugmap',
                useCurrentLocation: true
			}
		]
	}
});
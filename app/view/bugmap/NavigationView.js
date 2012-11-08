Ext.define('Kort.view.bugmap.NavigationView', {
	extend: 'Ext.navigation.View',
	alias: 'widget.bugmapnavigationview',
    requires: [
        'Ext.ux.LeafletMap',
        'Ext.TitleBar'
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
                    id: 'refreshBugsButton',
                    iconCls: 'refresh',
                    iconMask: true,
                    align: 'right'
                }
            ]
        },
		items: [
			{
                title: Ext.i18n.Bundle.message('bugmap.title'),
                
                xtype: 'leafletmap',
                id: 'bugmap',
                useCurrentLocation: true,
                autoMapCenter: false,
                mapOptions: {
                    zoom: Kort.util.Config.getLeafletMap().zoom
                },
                tileLayerUrl: Kort.util.Config.getLeafletMap().tileLayerUrl,
                tileLayerOptions: {
                    apikey: Kort.util.Config.getLeafletMap().apiKey,
                    styleId: Kort.util.Config.getLeafletMap().styleId
                }
			}
		]
	}
});
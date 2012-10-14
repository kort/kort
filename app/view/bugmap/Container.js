Ext.define('Kort.view.bugmap.Container', {
	extend: 'Ext.Container',
	alias: 'widget.bugmapcontainer',
    requires: [
        'Ext.ux.LeafletMap',
        'Ext.TitleBar'
    ],
	
	config: {
		title: 'Bugs',
		url: 'bugmap',
		id: 'bugmapContainer',
		iconCls: 'maps',
		layout: 'fit',
		items: [
			{
				xtype: 'titlebar',
				cls: 'titlebar',
				docked: 'top',
				title: 'Bugs'
			},
			{
                xtype: 'leafletmap',
                id: 'bugmap',
                useCurrentLocation: true,
                autoMapCenter: false,
                mapOptions: {
                    zoom: 15
                },
                tileLayerUrl: 'http://{s}.tile.cloudmade.com/{apikey}/{styleId}/256/{z}/{x}/{y}.png',
                tileLayerOptions: {
                    apikey: '729242682cb24de8aa825c8aed993cba',
                    styleId: 997
                }
			}
		]
	}
});
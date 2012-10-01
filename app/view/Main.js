Ext.define('OpenLayersApp.view.Main', {
    extend: 'Ext.tab.Panel',
    xtype: 'main',
	id: 'mainTabPanel',
	requires: ['Ext.ux.OpenLayersMap'],
	
    config: {
		tabBar: {
			docked: 'bottom',
			layout: {
				pack: 'start'
			}
		},

        items: [
            {
                title: 'OpenStreetMap',
                iconCls: 'maps',
				layout: 'fit',

                items: [
					{
						xtype: 'openlayersmap',
						id: 'openlayersmap',
						useCurrentLocation: true,
						autoMapCenter: false,
						mapOptions: {
							zoom: 9
						}
					}
				]
            }
        ]
    }
});

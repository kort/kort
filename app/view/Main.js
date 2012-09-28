Ext.define('OpenLayersApp.view.Main', {
    extend: 'Ext.tab.Panel',
    xtype: 'main',
	id: 'mainTabPanel',
	
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
						autoMapCenter: true,
						mapOptions: {
							zoom: 12
						},
						transformLonLatFn: function(lonLatObj) {
							var ol = window.OpenLayers,
								fromProjection = new ol.Projection("EPSG:4326"), // Transform from WGS 1984
								toProjection   = new ol.Projection("EPSG:3857"); // to Spherical Mercator Projection
							return lonLatObj.transform(fromProjection, toProjection);
						}
					}
				]
            }
        ]
    }
});

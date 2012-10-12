Ext.define('Kort.view.Main', {
    extend: 'Ext.tab.Panel',
    xtype: 'main',
    id: 'mainTabPanel',
    requires: ['Ext.ux.LeafletMap'],

    config: {
        tabBar: {
            docked: 'bottom',
            layout: {
                pack: 'start'
            }
        },

        items: [
            {
                title: Ext.i18n.Bundle.message('tabpanel.map'),
                iconCls: 'maps',
                layout: 'fit',

                items: [
                    {
                        xtype: 'leafletmap',
                        id: 'leafletmap',
                        useCurrentLocation: true,
                        autoMapCenter: false,
                        mapOptions: {
                            zoom: 15
                        },
                        tileLayerUrl: 'http://{s}.tile.cloudmade.com/{apikey}/{styleId}/256/{z}/{x}/{y}.png',
                        tileLayerOptions: {
                            apikey: '729242682cb24de8aa825c8aed993cba',
                            styleId: 997,
                            detectRetina: false
                        }
                    }
                ]
            }
        ]
    }
});

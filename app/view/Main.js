Ext.define('Kort.view.Main', {
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
                title: Ext.i18n.Bundle.message('tabpanel.map'),
                iconCls: 'maps',
                layout: 'fit',

                items: [
                    {
                        xtype: 'openlayersmap',
                        id: 'openlayersmap',
                        useCurrentLocation: true,
                        autoMapCenter: false,
                        mapOptions: {
                            zoom: 15,
                            controls: [
                                new OpenLayers.Control.TouchNavigation({
                                    dragPanOptions: {
                                        enableKinetic: true
                                    }
                                }),
                                new OpenLayers.Control.Zoom()
                            ]
                        }
                    }
                ]
            }
        ]
    }
});

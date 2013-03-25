Ext.define('Kort.view.markermap.NavigationView', {
    extend: 'Ext.navigation.View',
    alias: 'widget.markermapnavigationview',
    requires: [
        'Kort.view.LeafletMap',
        'Ext.Button'
    ],

    config: {
        title: Ext.i18n.Bundle.message('tab.map'),
        url: 'map',
        id: 'markermapNavigationView',
        iconCls: 'maps',
        defaultBackButtonText: Ext.i18n.Bundle.message('button.back'),

        navigationBar: {
            items: [
                {
                    xtype: 'button',
                    cls: 'markermapCenterButton',
                    iconCls: 'locate',
                    iconMask: true,
                    align: 'left'
                },
                {
                    xtype: 'button',
                    cls: 'markermapRefreshButton',
                    iconCls: 'refresh',
                    iconMask: true,
                    align: 'right'
                }
            ],
            // SENCAH TOUCH BUGFIX:
            // disable navigationBar animation because of wrong title positioning
            animation: false
        }
    }
});
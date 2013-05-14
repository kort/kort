/**
 * Main navigation view for map tap.
 */
Ext.define('Kort.view.map.NavigationView', {
    extend: 'Ext.navigation.View',
    alias: 'widget.mapnavigationview',

    /**
     * @event sneakypeaktoggled
     * Fired when sneaky peak segmented button was pressed.
     * @param {Boolean} isPressed State of service (on or off).
     */

    requires: [
        'Kort.view.LeafletMap',
        'Ext.Button'
    ],

    config: {
        title: Ext.i18n.Bundle.message('tab.map'),
        url: 'map',
        id: 'mapNavigationView',
        iconCls: 'maps',
        defaultBackButtonText: Ext.i18n.Bundle.message('button.back'),

        navigationBar: {
            items: [
                {
                    xtype: 'button',
                    cls: 'mapCenterButton',
                    iconCls: 'locate',
                    iconMask: true,
                    align: 'left'
                },
                {
                    xtype: 'segmentedbutton',
                    cls: 'sneakyPeak',
                    allowMultiple: true,
                    items: [
                        {
                            iconCls: 'look',
                            iconMask: true
                        }
                    ],
                    align: 'right'
                },
                {
                    xtype: 'button',
                    cls: 'mapRefreshButton',
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
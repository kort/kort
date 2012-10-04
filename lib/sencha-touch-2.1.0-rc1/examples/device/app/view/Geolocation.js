/**
 *
 */
Ext.define('Device.view.Geolocation', {
    extend: 'Ext.Container',
    xtype: 'geolocation',

    requires: [
        'Ext.device.Geolocation',
        'Ext.device.Notification',
        'Ext.Map',
        'Ext.TitleBar',
        'Ext.tab.Bar',
        'Ext.SegmentedButton'
    ],

    config: {
        title  : 'Geolocation',
        iconCls: 'maps',
        layout: 'fit',

        masked: {
            xtype: 'loadmask'
        },

        items: [
            {
                xtype: 'titlebar',
                ui: 'neutral',
                docked: 'top',
                items: [
                    {
                        xtype: 'segmentedbutton',
                        align: 'left',
                        items: [
                            {
                                action: 'watch',
                                text: 'Watch'
                            }
                        ]
                    },
                    {
                        action: 'refresh',
                        align: 'right',
                        iconCls: 'refresh',
                        iconMask: true
                    }
                ]
            },
            {
                xtype: 'map'
            }
        ],

        control: {
            'button[action=refresh]': {
                tap: 'refresh'
            },
            'segmentedbutton': {
                toggle: 'watchToggle'
            }
        }
    },

    initialize: function() {
        this.callParent(arguments);

        this.on({
            scope: this,
            painted: 'onPainted'
        });

        //Tracking Marker Image
        this.map = this.down('map');

        this.marker = new google.maps.Marker({
            map: this.map.getMap()
        });
    },

    onPainted: function() {
        this.refresh();
    },

    refresh: function() {
        Ext.device.Geolocation.getCurrentPosition({
            scope: this,
            success: function(position) {
                this.setMasked(false);
                this.map.setMapCenter(position.coords);
                this.marker.setPosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
            },
            failure: function() {
                this.setMasked(false);
                Ext.device.Notification.show({
                    title: 'Geolocation',
                    message: 'Something went wrong.'
                });
            }
        });
    },

    watchToggle: function(segmentedButton, button, pressed) {
        if (pressed) {
            Ext.device.Geolocation.watchPosition({
                frequency: 3000,
                scope: this,
                callback: function(position) {
                    this.map.setMapCenter(position.coords);
                    this.marker.setPosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
                },
                failure: function() {
                    Ext.device.Notification.show({
                        title: 'Geolocation',
                        message: 'Something went wrong.'
                    });
                }
            });
        } else {
            Ext.device.Geolocation.clearWatch();
        }
    }
});

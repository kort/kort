//<debug>
Ext.Loader.setPath({
    'Ext': '../../src',
    'Ext.plugin': 'lib/plugin'
});
//</debug>

/**
 * This is a demo application which shows the Ext.Map component in Sencha Touch.
 */
Ext.application({
    startupImage: {
        '320x460': 'resources/startup/Default.jpg', // Non-retina iPhone, iPod touch, and all Android devices
        '640x920': 'resources/startup/640x920.png', // Retina iPhone and iPod touch
        '640x1096': 'resources/startup/640x1096.png', // iPhone 5 and iPod touch (fifth generation)
        '768x1004': 'resources/startup/768x1004.png', //  Non-retina iPad (first and second generation) in portrait orientation
        '748x1024': 'resources/startup/748x1024.png', //  Non-retina iPad (first and second generation) in landscape orientation
        '1536x2008': 'resources/startup/1536x2008.png', // : Retina iPad (third generation) in portrait orientation
        '1496x2048': 'resources/startup/1496x2048.png' // : Retina iPad (third generation) in landscape orientation
    },

    isIconPrecomposed: false,
    icon: {
        57: 'resources/icons/icon.png',
        72: 'resources/icons/icon@72.png',
        114: 'resources/icons/icon@2x.png',
        144: 'resources/icons/icon@144.png'
    },

    requires: [
        'Ext.Map',
        'Ext.Button',
        'Ext.SegmentedButton',
        'Ext.Panel',
        'Ext.Toolbar',
        'Ext.plugin.google.Traffic',
        'Ext.plugin.google.Tracker'
    ],

    launch: function() {
        // The following is accomplished with the Google Map API
        var position = new google.maps.LatLng(37.44885, -122.158592),  //Sencha HQ

            infowindow = new google.maps.InfoWindow({
                content: 'Sencha HQ'
            }),

            //Tracking Marker Image
            image = new google.maps.MarkerImage(
                'resources/images/point.png',
                new google.maps.Size(32, 31),
                new google.maps.Point(0, 0),
                new google.maps.Point(16, 31)
            ),

            shadow = new google.maps.MarkerImage(
                'resources/images/shadow.png',
                new google.maps.Size(64, 52),
                new google.maps.Point(0, 0),
                new google.maps.Point(-5, 42)
            ),

            trackingButton = Ext.create('Ext.Button', {
                iconMask: true,
                iconCls: 'locate'
            }),

            trafficButton = Ext.create('Ext.Button', {
                iconMask: true,
                pressed: true,
                iconCls: 'maps'
            }),

            toolbar = Ext.create('Ext.Toolbar', {
                docked: 'top',
                ui: 'light',
                defaults: {
                    iconMask: true
                },
                items: [
                    {
                        iconCls: 'home',
                        handler: function() {
                            //disable tracking
                            var segmented = Ext.getCmp('segmented'),
                                pressedButtons = segmented.getPressedButtons(),
                                trafficIndex = pressedButtons.indexOf(trafficButton),
                                newPressed = (trafficIndex != -1) ? [trafficButton] : [];
                            segmented.setPressedButtons(newPressed);
                            mapdemo.getMap().panTo(position);
                        }
                    },
                    {
                        id: 'segmented',
                        xtype: 'segmentedbutton',
                        allowMultiple: true,
                        listeners: {
                            toggle: function(buttons, button, active) {
                                if (button == trafficButton) {
                                    mapdemo.getPlugins()[1].setHidden(!active);
                                }
                                else if (button == trackingButton) {
                                    var tracker = mapdemo.getPlugins()[0],
                                        marker = tracker.getMarker();
                                    marker.setVisible(active);
                                    if (active) {
                                        tracker.setTrackSuspended(false);
                                        Ext.defer(function() {
                                            tracker.getHost().on('centerchange', function() {
                                                marker.setVisible(false);
                                                tracker.setTrackSuspended(true);
                                                var segmented = Ext.getCmp('segmented'),
                                                    pressedButtons = segmented.getPressedButtons(),
                                                    trafficIndex = pressedButtons.indexOf(trafficButton),
                                                    newPressed = (trafficIndex != -1) ? [trafficButton] : [];
                                                segmented.setPressedButtons(newPressed);
                                            }, this, {single: true});
                                        }, 50, this);
                                    }
                                }
                            }
                        },
                        items: [
                            trackingButton, trafficButton
                        ]
                    }
                ]
            });

        var mapdemo = Ext.create('Ext.Map', {
            mapOptions : {
                center : new google.maps.LatLng(37.381592, -122.135672),  //nearby San Fran
                zoom : 12,
                mapTypeId : google.maps.MapTypeId.ROADMAP,
                navigationControl: true,
                navigationControlOptions: {
                    style: google.maps.NavigationControlStyle.DEFAULT
                }
            },

            plugins : [
                new Ext.plugin.google.Tracker({
                    trackSuspended: true,   //suspend tracking initially
                    allowHighAccuracy: false,
                    marker: new google.maps.Marker({
                        position: position,
                        title: 'My Current Location',
                        shadow: shadow,
                        icon: image
                    })
                }),
                new Ext.plugin.google.Traffic()
            ],

            listeners: {
                maprender: function(comp, map) {
                    var marker = new google.maps.Marker({
                        position: position,
                        title : 'Sencha HQ',
                        map: map
                    });

                    google.maps.event.addListener(marker, 'click', function() {
                        infowindow.open(map, marker);
                    });

                    setTimeout(function() {
                        map.panTo(position);
                    }, 1000);
                }

            }
        });

        Ext.create('Ext.Panel', {
            fullscreen: true,
            layout: 'fit',
            items: [toolbar, mapdemo]
        });
    }
});

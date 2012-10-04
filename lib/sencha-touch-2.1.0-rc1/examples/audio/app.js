//<debug>
Ext.Loader.setPath({
    'Ext': '../../src'
});
//</debug>

/**
 * A simple example which demonstrates the Ext.Audio component in Sencha Touch.
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
        'Ext.Audio',
        'Ext.Button',
        'Ext.tab.Panel'
    ],

    launch: function() {
        var audioBase = {
            xtype: 'audio',
            url  : 'crash.mp3',
            loop : true
        };

        var hiddenAudio = Ext.create('Ext.Container', {
            title: 'Hidden',
            layout: {
                type: 'vbox',
                pack: 'center'
            },
            items: [
                {
                    xtype : 'button',
                    text  : 'Play audio',
                    margin: 20,
                    handler: function() {
                        var audio = this.getParent().down('audio');

                        if (audio.isPlaying()) {
                            audio.pause();
                            this.setText('Play audio');
                        } else {
                            audio.play();
                            this.setText('Pause audio');
                        }
                    }
                },
                Ext.apply({}, audioBase, {
                    enableControls: false
                })
            ]
        });

        var styledAudio = Ext.create('Ext.Audio', Ext.apply({}, audioBase, {
            title: 'Styled',
            cls: 'myAudio',
            layout: 'fit',
            enableControls: true
        }));

        var autoAudio = Ext.create('Ext.Audio', Ext.apply({}, audioBase, {
            title: 'autoResume',
            autoResume: true
        }));

        var items = [];

        if (Ext.os.is.Android) {
            //android devices do not support the <audio> tag controls
            items = [
                {
                    xtype: 'container',
                    layout: {
                        type: 'vbox',
                        pack: 'center'
                    },
                    title: 'Audio Sample',
                    items: hiddenAudio
                }
            ];
        } else {
            items = [hiddenAudio, styledAudio];
            if (Ext.os.deviceType.toLowerCase() != "phone") {
                items.push(autoAudio);
            }
        }

        Ext.create('Ext.tab.Panel', {
            fullscreen: true,
            tabBarPosition: 'top',
            items: items
        });
    }
});


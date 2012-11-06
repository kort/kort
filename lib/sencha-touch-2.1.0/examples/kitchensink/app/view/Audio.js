/**
 * Demonstrates usage of the Ext.Audio component
 */
Ext.define('Kitchensink.view.Audio', {
    extend: 'Ext.Container',
    requires: [
        'Ext.Audio'
    ],
    config: {
        layout: Ext.os.is.Android ? {
            type: 'vbox',
            pack: 'center',
            align: 'center'
        } : 'fit',
        items: Ext.os.is.Android ? [
            {
                xtype: 'audio',
                cls: 'myAudio',
                url: '../audio/crash.mp3',
                loop: true,
                enableControls: false
            },
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
            }
        ] : [
            {
                xtype: 'audio',
                cls: 'myAudio',
                url: '../audio/crash.mp3',
                loop: true
            }
        ]
    }
});

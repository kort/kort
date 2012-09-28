/**
 * Demonstrates the Ext.Video component
 */
Ext.define('Kitchensink.view.Video', {
    extend: 'Ext.Container',
    requires: [
        'Ext.Video'
    ],
    config: {
        layout: 'fit',
        items: [{
            xtype: 'video',
            url: ['../video/resources/media/BigBuck.m4v', '../video/resources/media/BigBuck.webm'],
            loop: true,
            posterUrl: '../video/resources/images/cover.jpg'
        }]
    }
});

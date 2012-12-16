/**
 * Main tabpanel of application
 */
Ext.define('Kort.view.Main', {
    extend: 'Ext.tab.Panel',
    xtype: 'main',
    id: 'mainTabPanel',
    requires: [
        'Kort.view.bugmap.NavigationView',
        'Kort.view.validation.NavigationView',
        'Kort.view.highscore.NavigationView',
        'Kort.view.profile.Container',
        'Kort.view.about.Container'
    ],
    
    config: {
        tabBar: {
            docked: 'bottom',
            layout: {
                pack: 'start'
            }
        },

        items: [
            {
                xtype: 'bugmapnavigationview'
            },
            {
                xtype: 'validationnavigationview'
            },
            {
                xtype: 'highscorenavigationview'
            },
            {
                xtype: 'profilecontainer'
            },
            {
                xtype: 'aboutcontainer'
            }
        ]
    }
});

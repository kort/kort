/**
 * Main tabpanel of application.
 */
Ext.define('Kort.view.Main', {
    extend: 'Ext.tab.Panel',
    xtype: 'main',
    id: 'mainTabPanel',
    requires: [
        'Kort.view.map.NavigationView',
        'Kort.view.highscore.NavigationView',
        'Kort.view.profile.Container',
        'Kort.view.news.NavigationView',
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
                xtype: 'mapnavigationview'
            },
            {
                xtype: 'highscorenavigationview'
            },
            {
                xtype: 'profilecontainer'
            },
            {
                xtype: 'newsnavigationview'
            },
            {
                xtype: 'aboutcontainer'
            }
        ]
    }
});

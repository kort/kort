/**
 * Main tabpanel of application
 */
Ext.define('Kort.view.Main', {
    extend: 'Ext.tab.Panel',
    xtype: 'main',
    id: 'mainTabPanel',
    requires: [
        'Kort.view.markermap.NavigationView',
        'Kort.view.highscore.NavigationView',
        'Kort.view.profile.Container',
        'Kort.view.news.Container',
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
                xtype: 'markermapnavigationview'
            },
            {
                xtype: 'highscorenavigationview'
            },
            {
                xtype: 'profilecontainer'
            },
            {
                xtype: 'newscontainer'
            },
            {
                xtype: 'aboutcontainer'
            }
        ]
    }
});

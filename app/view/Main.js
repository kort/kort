Ext.define('Kort.view.Main', {
    extend: 'Ext.tab.Panel',
    xtype: 'main',
    id: 'mainTabPanel',

    config: {
        tabBar: {
            docked: 'bottom',
            layout: {
                pack: 'start'
            }
        },

        items: [
            {
                xtype: 'logincontainer'
            },
            {
                xtype: 'bugmapnavigationview'
            },
            {
                xtype: 'verifycontainer'
            },
            {
                xtype: 'highscorecontainer'
            },
            {
                xtype: 'profilecontainer'
            }
        ]
    }
});

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
                xtype: 'bugmapnavigationview'
            },
            {
                xtype: 'validationnavigationview'
            },
            {
                xtype: 'highscorecontainer'
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

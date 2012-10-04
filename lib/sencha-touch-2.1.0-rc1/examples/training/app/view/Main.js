
Ext.define('CrimeFinder.view.Main', {
    extend: 'Ext.tab.Panel',
    xtype: 'crimefindermain',
    requires: [
        'Ext.TitleBar',
        'CrimeFinder.view.Hello',
        'CrimeFinder.view.crimereport.CrimeReport',
        'CrimeFinder.view.media.Media',
        'CrimeFinder.view.news.News',
        'CrimeFinder.view.MostWanteds',
        'CrimeFinder.view.Confess'
    ],

    config: {
        tabBarPosition: 'bottom',
        items: [
            {
                xtype: 'titlebar',
                docked: 'top',
                title: 'CrimeFinder'
            },
            {
                xtype: 'crimereport',
                title: 'Activity',
                iconCls: 'maps'
            },
            {
                xtype: 'mostwanteds',
                title: 'Wanted',
                iconCls: 'warning_black'
            },
            {
                xtype: 'news',
                title: 'News',
                iconCls: 'rss'
            },
            {
                xtype: 'crimefindermedia',
                title: 'Media',
                iconCls: 'tv'
            },
            {
                xtype: 'confessform',
                title: 'Confess',
                iconCls: 'user_business'
            }
        ]
    }
});

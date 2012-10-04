
Ext.define('CrimeFinder.view.bigphone.Main', {
    extend: 'Ext.tab.Panel',
  
    requires: [
        'Ext.tab.Panel',
        'Ext.TitleBar',
        'CrimeFinder.view.media.Media',
        'CrimeFinder.view.Confess',
        'CrimeFinder.view.MostWanteds',
        'CrimeFinder.view.news.News',
        'CrimeFinder.view.crimereport.CrimeReport'
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

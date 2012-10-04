
Ext.define('CrimeFinder.view.tablet.Main', {
    extend: 'CrimeFinder.view.Main',
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
        tabBarPosition: 'top',
        tabBar: {
        	 layout: {pack: 'center'}  	 
        },
        items: [
            {
                xtype: 'titlebar',
                docked: 'top',
                title: 'CrimeFinder'
            },
            {
                xtype: 'crimereport',
                title: 'Activity',
                iconCls: 'maps',
                iconAlign: 'left',
                iconMask: true
            },
            {
                xtype: 'mostwanteds',
                title: 'Wanted',
                iconCls: 'warning_black',
                 iconMask: true
            },
            {
                xtype: 'news',
                title: 'News',
                iconCls: 'rss',
                 iconMask: true
            },
            {
                xtype: 'crimefindermedia',
                title: 'Media',
                iconCls: 'tv',
                 iconMask: true
            },
            {
                xtype: 'confessform',
                title: 'Confess',
                iconCls: 'user_business',
                 iconMask: true
            }
        ]
    }
});

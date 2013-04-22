/**
 * Main navigation view for news tab
 */
Ext.define('Kort.view.news.NavigationView', {
    extend: 'Ext.navigation.View',
    alias: 'widget.newsnavigationview',
    requires: [
        'Ext.TitleBar',
        'Kort.view.news.List'
    ],

    config: {
        title: Ext.i18n.Bundle.message('tab.news'),
        url: 'news',
        id: 'newsNavigationView',
        iconCls: 'bulb',
        defaultBackButtonText: Ext.i18n.Bundle.message('button.back'),

        navigationBar: {
            items: [
                {
                    xtype: 'button',
                    cls: 'newsRefreshButton',
                    iconCls: 'refresh',
                    iconMask: true,
                    align: 'right'
                }
            ],
            // SENCHA TOUCH BUGFIX:
            // disable navigationBar animation because of wrong title positioning
            animation: false
        },

        items: [
            {
                title: Ext.i18n.Bundle.message('news.title'),
                xtype: 'newslist'
            }
        ]
    }
});
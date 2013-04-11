/**
 * Main container for news tab
 */
Ext.define('Kort.view.news.Container', {
    extend: 'Ext.Container',
    alias: 'widget.newscontainer',
    requires: [
        'Ext.TitleBar'
    ],

    config: {
        title: Ext.i18n.Bundle.message('tab.news'),
        url: 'news',
        id: 'newsContainer',
        iconCls: 'favorites',
        layout: 'vbox',
        scrollable: true,
        items: [
            {
                xtype: 'titlebar',
                cls: 'titlebar',
                docked: 'top',
                title: Ext.i18n.Bundle.message('news.title')
            },
            {
                html:   '<div class="news-content">' +
                    '<dl class="kort-definitionlist info">' +
                    '<dd class="image-hsr-logo"><a href="http://www.hsr.ch/informatik" target="_blank"><img src="resources/images/hsr_logo.png" /></a></dd>' +
                    '</dl>' +
                    '</div>'
            }
        ]
    }
});

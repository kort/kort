/**
 * News list
 */
Ext.define('Kort.view.news.List', {
    extend: 'Ext.List',
    alias: 'widget.newslist',
    config: {
        store: 'NewsLocal',
        itemTpl: new Ext.XTemplate(
            '<div class="newsItem',
                '<tpl if="unread==true"> unreadstyle "><img class="starImage" src="./resources/images/littleStar@2X.png"/>',
               '<tpl else>"></tpl>',
                '{title}</div>'
        ),

        emptyText: Ext.i18n.Bundle.message('news.list.emptytext'),
        disableSelection: true,
        grouped: false
    }
});
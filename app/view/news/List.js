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
                '<tpl if="unread==true"> unreadstyle "><ln><li> ',
               '<tpl else>"></tpl>',
                '{title}' +
                '<tpl if="unread==true"></li></ln></tpl>'+
                '</div>'

        ),

        emptyText: Ext.i18n.Bundle.message('news.list.emptytext'),
        disableSelection: true,
        grouped: false
    }
});
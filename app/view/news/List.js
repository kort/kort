/**
 * News list
 */
Ext.define('Kort.view.news.List', {
    extend: 'Ext.List',
    alias: 'widget.newslist',
    config: {
        store: 'NewsLocal',
        itemTpl: '<div class="news"><strong>{title}</strong></div>',
        emptyText: Ext.i18n.Bundle.message('news.list.emptytext'),
        disableSelection: true,
        grouped: true
    }
});
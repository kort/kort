/**
 * Component which shows news content
 */
Ext.define('Kort.view.news.newsEntry.ContentComponent', {
    extend: 'Ext.Component',
    alias: 'widget.newsnewsentrycontentcomponent',

    config: {
        cls: 'newsNewsEntryContentComponent',

        tpl: new Ext.XTemplate(

            '<div class="newsclass">',
            '<div class="title">{title}</div>',
            '<span class="dateText">' + Ext.i18n.Bundle.message('news.updated') + ': ' + '</span>',
            '<br>',
            '<span class="date"> {updated}</span>',
            '<div class="text">{content}</div>',
            '</div>'
        )
    }
});

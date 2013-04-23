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
            '<span class="dateText">' + Ext.i18n.Bundle.message('news.updated') + ': ' + '</span>',
            '<dd> {updated}</dd>',
            '<div class="text">{content}</div>',
            '</div>'
        )
    }
});

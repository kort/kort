/**
 * Component which shows news content.
 */
Ext.define('Kort.view.news.newsEntry.ContentComponent', {
    extend: 'Ext.Component',
    alias: 'widget.newsnewsentrycontentcomponent',

    config: {
        cls: 'newsNewsEntryContentComponent',

        tpl: new Ext.XTemplate(

            '<div class="newsclass">',
            '<div class="title">{title}</div>',
            '<span class="date">{updated:date("d.m.Y")}</span>',
            '<div class="text">{content}</div>',
            '</div>'
        )
    }
});

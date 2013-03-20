/**
 *
 */

Ext.define('Kort.view.bugmap.CampaignOverlay', {
    extend: 'Ext.Container',
    config: {

    },
    html: '<div class="testclass">asd</div>',
    tpl:    new Ext.XTemplate(
        '<div class="bugmap-campaign-overlay">',
        '<p>',
        '{typec}',
        '</p>',
        '<img class="koin-image" src="./resources/images/i.png"/>',
        '</div>'
    )
});
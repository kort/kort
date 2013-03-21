/**
 *
 */

Ext.define('Kort.view.bugmap.CampaignOverlay', {
    extend: 'Ext.Component',

    config: {
        cls: 'transparentPanel',
        style:'background-color: transparent;margin:auto;float:left;',
        zIndex: Kort.util.Config.getZIndex().overlayLeafletMap+1,
        tpl:    new Ext.XTemplate(
            '<div class="bugmap-campaign-overlay" />'
        )
    }

});
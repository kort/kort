Ext.define('Kiva.view.detail.Information', {
    extend: 'Ext.Container',
    xtype: 'detailInformation',
    requires: ['Ext.XTemplate'],

    config: {
        cls: 'detail-card',
        styleHtmlContent: true,
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },

        tpl: Ext.create('Ext.XTemplate',
            '<h1>{name}</h1>',
            '<h2><tpl if="location.town">{location.town}, </tpl>{location.country}</h2>',
            '<p class="overview">',
                '<strong>Activity:</strong> {activity}<br />',
                '<strong>Sector:</strong> {sector}<br />',
                '<strong>Amount requested:</strong> ${terms.loan_amount}<br />',
                '<strong>Amount funded:</strong> ${funded_amount}<br />',
            '</p>',
            '<p><strong>Overview</strong><br />{description}</p>'
            // {compiled: true}
        )
    }
});
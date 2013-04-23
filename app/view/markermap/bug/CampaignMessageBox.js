Ext.define('Kort.view.markermap.bug.CampaignMessageBox', {
    extend: 'Ext.MessageBox',

    config: {
        cls: 'campaignMessageBox',
        zIndex: Kort.util.Config.getZIndex().overlayLeafletMap + 1,
        showAnimation: {animation:{type:'flip'}},
        hideAnimation: {animation:{type:'flip'}}

    },
    tpl: new Ext.XTemplate(
        '<div id="campaignMessageBox-wrapper">',
        '<div class="titleText">{title}</div>',
        '<div class="dateText">',
        '{[this.getMessage("markermap.bug.campaignmessagebox.date", {startdate: values.startdate, enddate: values.enddate})]}',
        '</div>',
        '<div class="koinsText">',
        '{[this.getMessage("markermap.bug.campaignmessagebox.earn", {extra_coins: values.extra_coins})]}',
        '</div>',

        '</div>'
    ),

    statics: {
        YES: [
            { text: Ext.i18n.Bundle.message('markermap.bug.campaignmessagebox.close'), itemId: 'yes', ui: 'action'}
        ]
    },

    /**
     * @inheritdoc
     * OVERRIDEN SENCHA TOUCH FUNCTION
     * CHANGE: use own yes/no labels
     */
    confirm: function (record, fn, scope, extraCoins) {
        //we get the extraCoins attribute only through mission-object. Add this information to the campaign object.
        record.data.extra_coins=extraCoins;
        return this.show({
            title: null,
            message: this.tpl.apply(record.data) || null,
            // use own yes/no labels
            buttons: Kort.view.markermap.bug.CampaignMessageBox.YES,
            promptConfig: false,
            scope: scope,
            fn: function () {
                if (fn) {
                    fn.apply(scope, arguments);
                }
            }
        });
    }

});

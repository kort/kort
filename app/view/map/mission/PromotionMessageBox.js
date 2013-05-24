/**
 * Message box which shows details about a promotion.
 */
Ext.define('Kort.view.map.mission.PromotionMessageBox', {
    extend: 'Ext.MessageBox',

    config: {
        cls: 'promotionMessageBox',
        zIndex: Kort.util.Config.getZIndex().overlayLeafletMap + 1,
        showAnimation: {animation:{type:'flip'}},
        hideAnimation: {animation:{type:'flip'}}

    },
    tpl: new Ext.XTemplate(
        '<div id="promotionMessageBox-wrapper">',
        '<div class="titleText">{title}</div>',
        '<div class="dateText">',
        '{[this.getMessage("map.mission.promotionmessagebox.date", {startdate: values.startdate, enddate: values.enddate})]}',
        '</div>',
        '<div class="koinsText">',
        '{[this.getMessage("map.mission.promotionmessagebox.earn", {extra_coins: values.extra_coins})]}',
        '</div>',

        '</div>'
    ),

    statics: {
        YES: [
            { text: Ext.i18n.Bundle.message('map.mission.promotionmessagebox.close'), itemId: 'yes', ui: 'action'}
        ]
    },

    /**
     * @inheritdoc
     * OVERRIDEN SENCHA TOUCH FUNCTION
     * CHANGE: use own yes/no labels
     */
    confirm: function (record, fn, scope, extraCoins) {
        //we get the extraCoins attribute only through mission-object.
        // Add this information to the promotion object.
        record.data.extra_coins=extraCoins;
        return this.show({
            title: null,
            message: this.tpl.apply(record.data) || null,
            // use own yes/no labels
            buttons: Kort.view.map.mission.PromotionMessageBox.YES,
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

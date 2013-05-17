Ext.define('Kort.view.map.validation.ValidationMessageBox', {
    extend: 'Ext.MessageBox',
    alias: 'widget.validationmessagebox',

    config: {
        cls: 'validationMessageBox',
        zIndex: Kort.util.Config.getZIndex().overlayLeafletMap,
        showAnimation:false,
        hideAnimation:false
    },

    tpl: new Ext.XTemplate(
       '<div class="messagebox-content">',
        '<div class="textpic">',
        '<div class="image">',
        '<img class="koin-image" src="./resources/images/koins/koin_no_value.png" />',
        '</div>',
        '<div class="content">',
        '<tpl if="this.isPromotion(state)">',
        '<p>',
        '{[this.getMessage("map.validation.validationmessagebox.koins.earnpromotion", {validation_koin_count: values.vote_koin_count, ' +
            'extra_coins: values.extra_coins})]}',
        '<img src="./resources/images/promotion/promotionInfoButton@X2.png" id="promotionInfoButton"/>',
        '</p>',
        ' <tpl else>',
        '<p>',
        '{[this.getMessage("map.validation.validationmessagebox.koins.earn", {validation_koin_count: values.vote_koin_count})]}',
        '</p>',
        '</tpl>',
        '</div>',
        '</div>',
        '<div class="textpic">',
        '<div class="image">',
        '<img class="missiontype-image" src="{[this.constructMissiontypeIcon(values.type,values.state,values.inOperationalRange)]}" />',
        '</div>',
        '<div class="content">{[this.getMessage("map.validation.validationmessagebox.checkit")]} ',
        //'<img src="./resources/images/validation/thumbs-up.png" /> ',
        //'<img src="./resources/images/validation/thumbs-down.png" />',
        '</div>',
        '</div>',
        '</div>',

        {
            //member functions:
            isPromotion: function(state) {
                return state===Kort.util.Config.getMapMarkerState().validationPromotion;
            },
            constructMissiontypeIcon: function(type,state,inOperationalRange) {
                return Kort.util.Config.constructMissionIconURL(type,state,true,inOperationalRange);
            }
        }
    ),



    statics: {
        YESNO: [
            { text: Ext.i18n.Bundle.message('map.mission.validationmessagebox.yes'), itemId: 'yes', ui: 'action'},
            { text: Ext.i18n.Bundle.message('map.mission.validationmessagebox.no'), itemId: 'no'}
        ],
        CLOSE: [
            //{ text: Ext.i18n.Bundle.message('map.mission.validationmessagebox.yes'), itemId: 'yes', ui: 'action'},
            { text: Ext.i18n.Bundle.message('map.mission.validationmessagebox.close'), itemId: 'no'}
        ],
        preventOpening: false
    },


    /**
     * @inheritdoc
     * OVERRIDEN SENCHA TOUCH FUNCTION
     * CHANGE: use own yes/no labels
     */
    confirm: function(record, fn, scope) {
        //register campaignInfoButton callback
        this.element.on({
            tap: function(e, dom) {
                if(!Kort.view.map.validation.ValidationMessageBox.preventOpening) {
                    scope._showPromotionMessageBox();
                }
                Ext.defer(function() {
                    Kort.view.map.validation.ValidationMessageBox.preventOpening=false;
                }, 1000);
            },
            delegate: '#promotionInfoButton',
            scope: this
        });

        return this.show({
            title       : record.data.title || null,
            record      : record,
            message     : this.tpl.apply(record.data) || null,
            // use own yes/no labels
            buttons     : record.get('inOperationalRange') ? Kort.view.map.validation.ValidationMessageBox.YESNO : Kort.view.map.validation.ValidationMessageBox.CLOSE,
            promptConfig: false,
            scope       : scope,
            fn: function() {
                if (fn) {
                    fn.apply(scope, arguments);
                }
            }
        });
    }
});
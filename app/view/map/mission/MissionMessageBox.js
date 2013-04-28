/**
 * Message box which shows mission details
 */
Ext.define('Kort.view.map.mission.MissionMessageBox', {
	extend: 'Ext.MessageBox',
	alias: 'widget.missionmessagebox',

    config: {
        cls: 'missionMessageBox',
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

        '{[this.getMessage("map.mission.missionmessagebox.koins.earnpromotion", {fix_koin_count: values.fix_koin_count, ' +
            'extra_coins: values.campaign_extra_coins})]}',
        '<img src="./resources/images/promotion/promotionInfoButton@X2.png" id="promotionInfoButton"/>',
        '</p>',
        ' <tpl else>',
        '<p>',
        '{[this.getMessage("map.mission.missionmessagebox.koins.earn", {fix_koin_count: values.fix_koin_count})]}',
        '</p>',
        '</tpl>',
        '</div>',
        '</div>',
        '<div class="textpic">',
        '<div class="image">',
        '<img class="bugtype-image" src="{[this.constructMissiontypeIcon(values.type,values.state,values.inOperationalRange)]}" />',
        '</div>',
        '<div class="content">',
        '<p>{description}</p>',
        '</div>',
        '</div>',
        '</div>',

        /*
         '<div class="image">',
         '<img class="bugtype-image" src="./resources/images/circle.png" />',
         '</div>',
         */
        {
            //member functions:
            isPromotion: function(state) {
                return state==Kort.util.Config.getMapMarkerState().missionPromotion;
            },
            constructMissiontypeIcon: function(type,state,inOperationalRange) {
                return Kort.util.Config.constructMissionIconURL(type,state,true,inOperationalRange);
            }
        }
    ),



    statics: {
        YESNO: [
            { text: Ext.i18n.Bundle.message('map.mission.missionmessagebox.yes'), itemId: 'yes', ui: 'action'},
            { text: Ext.i18n.Bundle.message('map.mission.missionmessagebox.no'), itemId: 'no'}
        ],
        CLOSE: [
            //{ text: Ext.i18n.Bundle.message('map.mission.missionmessagebox.yes'), itemId: 'yes', ui: 'action'},
            { text: Ext.i18n.Bundle.message('map.mission.missionmessagebox.close'), itemId: 'no'}
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
                if(!Kort.view.map.mission.MissionMessageBox.preventOpening) {
                    scope.showPromotionMessageBox();
                }
                Ext.defer(function() {
                    Kort.view.map.mission.MissionMessageBox.preventOpening=false;
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
            buttons     : record.get('inOperationalRange') ? Kort.view.map.mission.MissionMessageBox.YESNO : Kort.view.map.mission.MissionMessageBox.CLOSE,
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
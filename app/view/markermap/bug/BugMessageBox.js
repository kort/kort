/**
 * Message box which shows bug details
 */
Ext.define('Kort.view.markermap.bug.BugMessageBox', {
	extend: 'Ext.MessageBox',
	alias: 'widget.bugmessagebox',

    config: {
        cls: 'bugMessageBox',
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

        '<tpl if="this.isCampaign(state)">',
        '<p>',

        '{[this.getMessage("markermap.bug.bugmessagebox.koins.earncamp", {fix_koin_count: values.fix_koin_count, ' +
            'extra_coins: values.campaign_extra_coins})]}',
        '<img src="./resources/images/promotion/promotionInfoButton@X2.png" id="campaignInfoButton"/>',
        '</p>',
        ' <tpl else>',
        '<p>',
        '{[this.getMessage("markermap.bug.bugmessagebox.koins.earn", {fix_koin_count: values.fix_koin_count})]}',
        '</p>',
        '</tpl>',
        '</div>',
        '</div>',
        '<div class="textpic">',
        '<div class="image">',
        '<img class="bugtype-image" src="{[this.constructBugtypeIcon(values.type,values.state)]}" />',
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
            isCampaign: function(state) {
                return state==Kort.util.Config.getMissionState().bugCampaign;
            },
            constructBugtypeIcon: function(type,state) {
                return Kort.util.Config.constructMissionIconURL(type,state,true);
            }
        }
    ),



    statics: {
        YESNO: [
            { text: Ext.i18n.Bundle.message('markermap.bug.bugmessagebox.yes'), itemId: 'yes', ui: 'action'},
            { text: Ext.i18n.Bundle.message('markermap.bug.bugmessagebox.no'), itemId: 'no'}
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
                if(!Kort.view.markermap.bug.BugMessageBox.preventOpening) {
                    scope.displayCampaignMessageBox();
                }
                Ext.defer(function() {
                    Kort.view.markermap.bug.BugMessageBox.preventOpening=false;
                }, 1000);
            },
            delegate: '#campaignInfoButton',
            scope: this
        });

        return this.show({
            title       : record.data.title || null,
            record      : record,
            message     : this.tpl.apply(record.data) || null,
            // use own yes/no labels
            buttons     : Kort.view.markermap.bug.BugMessageBox.YESNO,
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
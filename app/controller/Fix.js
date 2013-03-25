/**
 * Controller for fix panel
 */
Ext.define('Kort.controller.Fix', {
    extend: 'Kort.controller.OsmMap',

    config: {
        views: [
            'markermap.NavigationView',
            'markermap.bug.fix.TabPanel',
            'markermap.bug.fix.Form',
            'LeafletMap',
            'RewardMessageBox'
        ],
        refs: {
            markermapNavigationView: '#markermapNavigationView',
            //bugmapNavigationView: '#bugmapNavigationView',
            detailComponent: '.fixtabpanel',
            fixFormSubmitButton: '.fixtabpanel .formpanel .button[cls=fixSubmitButton]',
            fixField: '.fixtabpanel .formpanel .field[name=fixfield]',
            fixFalsepositiveToggleField: '.fixtabpanel .formpanel .togglefield[name=falsepositive]',
            fixmap: '.fixtabpanel .kortleafletmap[cls=fixMap]'
        },
        control: {
            fixFormSubmitButton: {
                tap: 'onFixFormSubmitButtonTap'
            },
            fixField: {
                keyup: 'onFixFieldKeyUp'
            },
            fixFalsepositiveToggleField: {
                change: 'onFixFalsepositiveToggleFieldChange'
            },
            fixmap: {
                maprender: 'onMaprender'
            }
        }
    },
    
    // @private
    onFixFormSubmitButtonTap: function() {
        var me = this,
            detailComponent = this.getDetailComponent(),
            fixFieldValue = this.getFixField().getValue(),
            falsepositive = me.getFixFalsepositiveToggleField().getValue(),
            userId = Kort.user.get('id'),
            falsepositiveString,
            fix,
            messageBox;

        if ((fixFieldValue && fixFieldValue !== '') || falsepositive) {
            me.showSendMask();
            // for valid post request field has to be a string
            falsepositiveString = falsepositive.toString();
            if(falsepositive) {
                fixFieldValue = '-';
            }
            fix = Ext.create('Kort.model.Fix', {
                error_id: detailComponent.getRecord().get('id'),
                schema: detailComponent.getRecord().get('schema'),
                osm_id: detailComponent.getRecord().get('osm_id'),
                user_id: userId,
                message: fixFieldValue,
                falsepositive: falsepositiveString
            });
            fix.save({
                success: function(records, operation) {
                    me.hideSendMask();
                    me.fixSuccessfulSubmittedHandler(operation.getResponse().responseText);
                },
                failure: function() {
                    me.hideSendMask();
                    var messageBox = Ext.create('Kort.view.NotificationMessageBox');
                    messageBox.alert(Ext.i18n.Bundle.message('fix.alert.submit.failure.title'), Ext.i18n.Bundle.message('fix.alert.submit.failure.message'), Ext.emptyFn);
                }
            });
        } else {
            messageBox = Ext.create('Kort.view.NotificationMessageBox');
            messageBox.alert(Ext.i18n.Bundle.message('fix.alert.fixfield.empty.title'), Ext.i18n.Bundle.message('fix.alert.fixfield.empty.message'), Ext.emptyFn);
        }
    },

    // @private
    onFixFieldKeyUp: function(field, e) {
        // submit form if return key was pressed
        if (e.event.keyCode === 13){
            this.onFixFormSubmitButtonTap();
        }
    },
    
    // @private
    onFixFalsepositiveToggleFieldChange: function(cmp, newValue, oldValue) {
        var value = cmp.getValue();
        if(value) {
            this.getFixField().hide();
        } else {
            this.getFixField().show();
        }
    },

    /**
     * @private
     * Called when a fix was successfully submitted
     * @param {String} responseText Response from server
     */
    fixSuccessfulSubmittedHandler: function(responseText) {
        var rewardConfig = JSON.parse(responseText),
            reward = Ext.create('Kort.model.Reward', rewardConfig),
            markermapNavigationView = this.getMarkermapNavigationView();
        
        this.showRewardMessageBox(reward);
        // remove detail panel
        markermapNavigationView.pop();
        markermapNavigationView.fireEvent('back', markermapNavigationView);
        this.getApplication().fireEvent('fixsend');
    },
    
    // @private
    showSendMask: function() {
        this.getMarkermapNavigationView().setMasked({
            xtype: 'loadmask',
            message: Ext.i18n.Bundle.message('fix.sendmask.message'),
            zIndex: Kort.util.Config.getZIndex().overlayLeafletMap
        });
    },
    
    // @private
    hideSendMask: function() {
        this.getMarkermapNavigationView().setMasked(false);
    },
    
    /**
     * @private
     * Shows message box with rewards
     * @param {Kort.model.Reward} reward Won reward
     */
	showRewardMessageBox: function(reward) {
        var messageBox = Ext.create('Kort.view.RewardMessageBox', {
            record: reward
        });
        messageBox.alert(Ext.i18n.Bundle.message('reward.alert.title'), messageBox.getRewardTpl().apply(reward.data), Ext.emptyFn);
	}
});
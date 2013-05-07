/**
 * Controller for fix panel
 */
Ext.define('Kort.controller.Fix', {
    extend: 'Kort.controller.OsmMap',
    requires: [
        'Kort.view.map.mission.fix.type.Select',
        'Kort.view.RewardMessageBox'
    ],
    config: {
        refs: {
            mapNavigationView: '#mapNavigationView',
            detailComponent: '.fixtabpanel',
            fixFormSubmitButton: '.fixtabpanel .formpanel .button[cls=fixSubmitButton]',
            fixField: '.fixtabpanel .formpanel .field[name=fixfield]',
            fixFalsepositiveToggleField: '.fixtabpanel .formpanel .togglefield[name=falsepositive]',
            fixmap: '.fixtabpanel .kortleafletmap[cls=fixMap]'
        },
        control: {
            fixFormSubmitButton: {
                tap: '_onFixFormSubmitButtonTap'
            },
            fixField: {
                keyup: '_onFixFieldKeyUp'
            },
            fixFalsepositiveToggleField: {
                change: '_onFixFalsepositiveToggleFieldChange'
            },
            fixmap: {
                maprender: 'onMaprender'
            }
        }
    },

    /**
     *
     * @private
     */
    _onFixFormSubmitButtonTap: function() {
        var me = this,
            detailComponent = this.getDetailComponent(),
            fixFieldValue = this.getFixField().getValue(),
            falsepositive = me.getFixFalsepositiveToggleField().getValue(),
            userId = Kort.user.get('id'),
            falsepositiveString,
            fix,
            messageBox;

        if ((fixFieldValue && fixFieldValue !== '') || falsepositive) {
            me._showSendMask();
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
                    me._fixSuccessfulSubmittedHandler(operation.getResponse().responseText);
                },
                failure: function() {
                    me._hideSendMask();
                    var messageBox = Ext.create('Kort.view.NotificationMessageBox');
                    messageBox.alert(Ext.i18n.Bundle.message('fix.alert.submit.failure.title'), Ext.i18n.Bundle.message('fix.alert.submit.failure.message'), Ext.emptyFn);
                }
            });
        } else {
            messageBox = Ext.create('Kort.view.NotificationMessageBox');
            messageBox.alert(Ext.i18n.Bundle.message('fix.alert.fixfield.empty.title'), Ext.i18n.Bundle.message('fix.alert.fixfield.empty.message'), Ext.emptyFn);
        }
    },

    /**
     *
     * @private
     * @param {Ext.field.Text} field
     * @param {Ext.event.Event} e
     */
    _onFixFieldKeyUp: function(field, e) {
        // submit form if return key was pressed
        if (e.event.keyCode === 13){
            this.onFixFormSubmitButtonTap();
        }
    },

    /**
     *
     * @private
     * @param {Ext.field.Toggle} cmp
     * @param {Object} newValue
     * @param {Object} oldValue
     */
    _onFixFalsepositiveToggleFieldChange: function(cmp, newValue, oldValue) {
        if(cmp.getValue()) {
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
    _fixSuccessfulSubmittedHandler: function(responseText) {
        var rewardConfig = JSON.parse(responseText),
            reward = Ext.create('Kort.model.Reward', rewardConfig),
            mapNavigationView = this.getMapNavigationView();
        
        this._showRewardMessageBox(reward);
        // remove detail panel
        mapNavigationView.pop();
        mapNavigationView.fireEvent('back', mapNavigationView);
        this.getApplication().fireEvent('fixsend');
    },

    /**
     *
     * @private
     */
    _showSendMask: function() {
        this.getMapNavigationView().setMasked({
            xtype: 'loadmask',
            message: Ext.i18n.Bundle.message('fix.sendmask.message'),
            zIndex: Kort.util.Config.getZIndex().overlayLeafletMap
        });
    },

    /**
     *
     * @private
     */
    _hideSendMask: function() {
        this.getMapNavigationView().setMasked(false);
    },
    
    /**
     * @private
     * Shows message box with rewards
     * @param {Kort.model.Reward} reward Won reward
     */
	_showRewardMessageBox: function(reward) {
        var messageBox = Ext.create('Kort.view.RewardMessageBox', {
            record: reward
        });
        messageBox.alert(Ext.i18n.Bundle.message('reward.alert.title'), messageBox.getRewardTpl().apply(reward.data), Ext.emptyFn);
	}
});
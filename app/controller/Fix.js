/**
 * Controller for fix panel
 */
Ext.define('Kort.controller.Fix', {
    extend: 'Kort.controller.OsmMap',

    config: {
        /**
         * @event fixsend
         * Fired when fix was sent
         * @param {Ext.ux.LeafletMap} this
         * @param {L.Map} map The rendered L.Map instance
         * @param {L.TileLayer} tileLayer The rendered L.TileLayer instance
         */
        
        views: [
            'bugmap.NavigationView',
            'bugmap.fix.TabPanel',
            'bugmap.fix.Form',
            'LeafletMap',
            'RewardMessageBox'
        ],
        refs: {
            bugmapNavigationView: '#bugmapNavigationView',
            detailComponent: '.fixtabpanel',
            fixFormSubmitButton: '.fixtabpanel .formpanel .button[cls=fixSubmitButton]',
            fixField: '.fixtabpanel .formpanel .field',
            fixmap: '.fixtabpanel .kortleafletmap[cls=fixMap]'
        },
        control: {
            fixFormSubmitButton: {
                tap: 'onFixFormSubmitButtonTap'
            },
            fixField: {
                keyup: 'onFixFieldKeyUp'
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
            userId = Kort.user.get('id'),
            fix,
            messageBox;

        if (fixFieldValue && fixFieldValue !== '') {
            me.showSendMask();
            fix = Ext.create('Kort.model.Fix', { error_id: detailComponent.getRecord().get('id'), user_id: userId, message: fixFieldValue });
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

    /**
     * @private
     * Called when a fix was successfully submitted
     * @param {String} responseText Response from server
     */
    fixSuccessfulSubmittedHandler: function(responseText) {
        var rewardConfig = JSON.parse(responseText),
            reward = Ext.create('Kort.model.Reward', rewardConfig),
            bugmapNavigationView = this.getBugmapNavigationView();
        
        this.getApplication().fireEvent('fixsend');
        
        this.showRewardMessageBox(reward);
        // remove detail panel
        bugmapNavigationView.pop();
        bugmapNavigationView.fireEvent('back', bugmapNavigationView);
    },
    
    // @private
    showSendMask: function() {
        this.getBugmapNavigationView().setMasked({
            xtype: 'loadmask',
            message: Ext.i18n.Bundle.message('fix.sendmask.message'),
            zIndex: Kort.util.Config.getZIndex().overlayLeafletMap
        });
    },
    
    // @private
    hideSendMask: function() {
        this.getBugmapNavigationView().setMasked(false);
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
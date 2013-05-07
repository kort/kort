/**
 * Controller for vote panel.
 */
Ext.define('Kort.controller.Vote', {
    extend: 'Kort.controller.OsmMap',
    requires: [
        'Kort.view.map.validation.AnswerActionSheet',
        'Kort.view.RewardMessageBox'
    ],
    config: {
        refs: {
            mapNavigationView: '#mapNavigationView',
            detailComponent: '.votecontainer',
            voteMap: '.votecontainer .kortleafletmap[cls=voteMap]',
            voteAnswerButton: '.votecontainer .button[cls=voteAnswerButton]',
            voteAnswerConfirmButton: '.voteansweractionsheet .button[cls=voteAnswerConfirmButton]',
            voteAnswerDeclineButton: '.voteansweractionsheet .button[cls=voteAnswerDeclineButton]',
            voteAnswerCancelButton: '.voteansweractionsheet .button[cls=voteAnswerCancelButton]'
        },
        control: {
            voteMap: {
                maprender: 'onMaprender'
            },
            voteAnswerButton: {
                tap: '_onVoteAnswerButtonTap'
            },
            voteAnswerConfirmButton: {
                tap: '_onVoteAnswerConfirmButtonTap'
            },
            voteAnswerDeclineButton: {
                tap: '_onVoteAnswerDeclineButtonTap'
            },
            voteAnswerCancelButton: {
                tap: '_onVoteAnswerCancelButtonTap'
            }
        },
        /**
         * @private
         */
        answerActionSheet: null
    },

    /**
     * @private
     */
    _onVoteAnswerButtonTap: function() {
        var answerActionSheet = Ext.create('Kort.view.map.validation.AnswerActionSheet');
        this.setAnswerActionSheet(answerActionSheet);
        Ext.Viewport.add(answerActionSheet);
        answerActionSheet.show();
    },

    /**
     * @private
     */
    _onVoteAnswerConfirmButtonTap: function() {
        if(this.getAnswerActionSheet()) {
            this.getAnswerActionSheet().hide();
        }
        this._sendVote(true);
    },

    /**
     * @private
     */
    _onVoteAnswerDeclineButtonTap: function() {
        if(this.getAnswerActionSheet()) {
            this.getAnswerActionSheet().hide();
        }
        this._sendVote(false);
    },

    /**
     * @private
     */
    _onVoteAnswerCancelButtonTap: function() {
        var mapNavigationView = this.getMapNavigationView();
        if(this.getAnswerActionSheet()) {
            this.getAnswerActionSheet().hide();
        }
        // remove detail panel
        mapNavigationView.pop();
        mapNavigationView.fireEvent('detailpop', mapNavigationView);
    },
    
    /**
     * @private
     * Sends vote to server.
     * @param {Boolean} valid Validation is correct (true) or wron (false).
     */
    _sendVote: function(valid) {
        var me = this,
            detailComponent = me.getDetailComponent(),
            userId = Kort.user.get('id'),
            vote,
            validString;
        
        // for valid post request valid field has to be a string
        validString = valid.toString();
        
        me._showSendMask();
        vote = Ext.create('Kort.model.Vote', {
            fix_id: detailComponent.getRecord().get('id'),
            user_id: userId, valid: validString
        });
        vote.save({
            success: function(records, operation) {
                me._hideSendMask();
                me._voteSuccessfulSubmittedHandler(operation.getResponse().responseText);
            },
            failure: function() {
                me._hideSendMask();
                var messageBox = Ext.create('Kort.view.NotificationMessageBox');
                messageBox.alert(Ext.i18n.Bundle.message('vote.alert.submit.failure.title'), Ext.i18n.Bundle.message('vote.alert.submit.failure.message'), Ext.emptyFn);
            }
        });
    },
    
    /**
     * @private
     * Called when vote was successfully submitted to server.
     * @param {String} responseText Response from server.
     */
    _voteSuccessfulSubmittedHandler: function(responseText) {
        var rewardConfig = Ext.decode(responseText),
            reward = Ext.create('Kort.model.Reward', rewardConfig),
            mapNavigationView = this.getMapNavigationView();
        
        this._showRewardMessageBox(reward);
        // remove detail panel
        mapNavigationView.pop();
        mapNavigationView.fireEvent('detailpop', mapNavigationView);
        this.getApplication().fireEvent('votesend');
    },

    /**
     * @private
     */
    _showSendMask: function() {
        this.getMapNavigationView().setMasked({
            xtype: 'loadmask',
            message: Ext.i18n.Bundle.message('vote.sendmask.message'),
            zIndex: Kort.util.Config.getZIndex().overlayLeafletMap
        });
    },

    /**
     * @private
     */
    _hideSendMask: function() {
        this.getMapNavigationView().setMasked(false);
    },
    
    /**
     * @private
     * Shows reward message box.
     * @param {Kort.model.Reward} reward Reward instance.
     */
	_showRewardMessageBox: function(reward) {
        var messageBox = Ext.create('Kort.view.RewardMessageBox', {
            record: reward
        });
        messageBox.alert(Ext.i18n.Bundle.message('reward.alert.title'), messageBox.getRewardTpl().apply(reward.data), Ext.emptyFn);
	}
});
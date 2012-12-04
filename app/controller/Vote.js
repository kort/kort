Ext.define('Kort.controller.Vote', {
    extend: 'Kort.controller.OsmMap',

    config: {
        views: [
            'validation.NavigationView',
            'validation.vote.Container',
            'validation.vote.AnswerActionSheet',
            'LeafletMap'
        ],
        refs: {
            validationNavigationView: '#validationNavigationView',
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
                tap: 'onVoteAnswerButtonTap'
            },
            voteAnswerConfirmButton: {
                tap: 'onVoteAnswerConfirmButtonTap'
            },
            voteAnswerDeclineButton: {
                tap: 'onVoteAnswerDeclineButtonTap'
            },
            voteAnswerCancelButton: {
                tap: 'onVoteAnswerCancelButtonTap'
            }
        },
        
        answerActionSheet: null
    },
    
    onVoteAnswerButtonTap: function() {
        var answerActionSheet = Ext.create('Kort.view.validation.vote.AnswerActionSheet');
        
        this.setAnswerActionSheet(answerActionSheet);
        Ext.Viewport.add(answerActionSheet);
        answerActionSheet.show();
    },
    
    onVoteAnswerConfirmButtonTap: function() {
        if(this.getAnswerActionSheet()) {
            this.getAnswerActionSheet().hide();
        }
        this.sendVote('true');
    },
    
    onVoteAnswerDeclineButtonTap: function() {
        if(this.getAnswerActionSheet()) {
            this.getAnswerActionSheet().hide();
        }
        this.sendVote('false');
    },
    
    onVoteAnswerCancelButtonTap: function() {
        if(this.getAnswerActionSheet()) {
            this.getAnswerActionSheet().hide();
        }
        // remove detail panel
        this.getValidationNavigationView().pop();
    },
    
    sendVote: function(valid) {
        var me = this,
            detailComponent = this.getDetailComponent(),
            userId = Kort.user.get('id'),
            vote;
            
        me.showSendMask();
        vote = Ext.create('Kort.model.Vote', { fix_id: detailComponent.getRecord().get('id'), user_id: userId, valid: valid });
        vote.save({
            success: function(records, operation) {
                me.hideSendMask();
                me.voteSuccessfulSubmittedHandler(operation.getResponse().responseText);
            },
            failure: function() {
                me.hideSendMask();
                var messageBox = Ext.create('Kort.view.NotificationMessageBox');
                messageBox.alert(Ext.i18n.Bundle.message('vote.alert.submit.failure.title'), Ext.i18n.Bundle.message('vote.alert.submit.failure.message'), Ext.emptyFn);
            }
        });
    },
    
    voteSuccessfulSubmittedHandler: function(responseText) {
        var rewardConfig = JSON.parse(responseText),
            reward = Ext.create('Kort.model.Reward', rewardConfig);
        
        this.getApplication().fireEvent('votesend');
        
        this.showRewardMessageBox(reward);
        // remove detail panel
        this.getValidationNavigationView().pop();
    },
    
    showSendMask: function() {
        this.getValidationNavigationView().setMasked({
            xtype: 'loadmask',
            message: Ext.i18n.Bundle.message('vote.sendmask.message'),
            zIndex: Kort.util.Config.getZIndex().overlayLeafletMap
        });
    },
    
    hideSendMask: function() {
        this.getValidationNavigationView().setMasked(false);
    },
    
	showRewardMessageBox: function(reward) {
        var messageBox = Ext.create('Kort.view.RewardMessageBox', {
            record: reward
        });
        messageBox.alert(Ext.i18n.Bundle.message('reward.alert.title'), messageBox.getRewardTpl().apply(reward.data), Ext.emptyFn);
	}
});
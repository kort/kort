Ext.define('Kort.controller.Vote', {
    extend: 'Kort.controller.OsmMap',

    config: {
        views: [
            'validation.NavigationView',
            'validation.vote.ButtonContainer',
            'validation.vote.Container',
            'validation.vote.TabPanel',
            'LeafletMap'
        ],
        refs: {
            validationNavigationView: '#validationNavigationView',
            detailTabPanel: '.votetabpanel',
            voteMap: '.votetabpanel .kortleafletmap[cls=voteMap]',
            voteAcceptButton: '.votetabpanel .votecontainer .button[cls=voteConfirmButton]',
            voteDeclineButton: '.votetabpanel .votecontainer .button[cls=voteDeclineButton]',
            voteCancelButton: '.votetabpanel .votecontainer .button[cls=voteCancelButton]'
        },
        control: {
            voteMap: {
                maprender: 'onMaprender'
            },
            voteAcceptButton: {
                tap: 'onVoteAcceptButtonTap'
            },
            voteDeclineButton: {
                tap: 'onVoteDeclineButtonTap'
            },
            voteCancelButton: {
                tap: 'onVoteCancelButtonTap'
            }
        }
    },
    
    onVoteAcceptButtonTap: function() {
        this.sendVote('accept');
    },
    
    onVoteDeclineButtonTap: function() {
        this.sendVote('decline');
    },
    
    onVoteCancelButtonTap: function() {
        // remove detail panel
        this.getValidationNavigationView().pop();
    },
    
    sendVote: function(message) {
        var me = this,
            detailTabPanel = this.getDetailTabPanel(),
            vote;

        vote = Ext.create('Kort.model.Vote', { validation_id: detailTabPanel.getRecord().get('id'), message: message });
        vote.save({
            success: function(records, operation) {
                me.voteSuccessfulSubmittedHandler(operation.getResponse().responseText);
            },
            failure: function() {
                var messageBox = Ext.create('Kort.view.NotificationMessageBox');
                messageBox.alert(Ext.i18n.Bundle.message('vote.alert.submit.failure.title'), Ext.i18n.Bundle.message('vote.alert.submit.failure.message'), Ext.emptyFn);
            }
        });
    },
    
    voteSuccessfulSubmittedHandler: function(responseText) {
        var rewardConfig = JSON.parse(responseText),
            reward = Ext.create('Kort.model.Reward', rewardConfig);
        
        this.reloadStores();
        this.showRewardMessageBox(reward);
        // remove detail panel
        this.getValidationNavigationView().pop();
    },
    
    reloadStores: function() {
        Kort.model.User.reload(Kort.user, 'secret');
    },
    
	showRewardMessageBox: function(reward) {
        var messageBox = Ext.create('Kort.view.RewardMessageBox', {
            record: reward
        });
        messageBox.alert(Ext.i18n.Bundle.message('reward.alert.title'), messageBox.getRewardTpl().apply(reward.data), Ext.emptyFn);
	}
});
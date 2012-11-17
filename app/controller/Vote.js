Ext.define('Kort.controller.Vote', {
    extend: 'Kort.controller.OsmMap',

    config: {
        views: [
            'validation.NavigationView',
            'validation.vote.ButtonContainer',
            'validation.vote.Container',
            'validation.vote.Map',
            'validation.vote.TabPanel'
        ],
        refs: {
            validationNavigationView: '#validationNavigationView',
            detailTabPanel: '.votetabpanel',
            voteMap: '.votetabpanel .votemap',
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
            success: function() {
                me.voteSuccessfulSubmittedHandler();
            },
            failure: function() {
                var messageBox = Ext.create('Kort.view.NotificationMessageBox');
                messageBox.alert(Ext.i18n.Bundle.message('vote.alert.submit.failure.title'), Ext.i18n.Bundle.message('vote.alert.submit.failure.message'), Ext.emptyFn);
            }
        });
    },
    
    voteSuccessfulSubmittedHandler: function() {
        this.showSubmittedPopupPanel();
        // remove detail panel
        this.getValidationNavigationView().pop();
    },

    /**
	 * Displays the confirmation popup
	 * @private
	 */
	showSubmittedPopupPanel: function() {
        var popupPanel = Ext.create('Kort.view.SubmittedPopupPanel');
		Ext.Viewport.add(popupPanel);
		popupPanel.show();
	}
});
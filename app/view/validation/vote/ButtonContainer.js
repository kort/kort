Ext.define('Kort.view.validation.vote.ButtonContainer', {
	extend: 'Ext.Container',
	alias: 'widget.votebuttoncontainer',
    requires: [
        'Ext.Button'
    ],
	
	config: {
        cls: 'voteButtonContainer',
        flex: 1,
        layout: {
            type: 'hbox',
            align: 'top'
        },
        defaults: {
            xtype: 'button',
            flex: 1
        },
        
        items: [
            {
                ui: 'confirm',
                cls: 'voteConfirmButton',
                text: Ext.i18n.Bundle.message('vote.container.button.accept')
            },
            {
                ui: 'decline',
                cls: 'voteDeclineButton',
                text: Ext.i18n.Bundle.message('vote.container.button.decline')
            },
            {
                cls: 'voteCancelButton',
                text: Ext.i18n.Bundle.message('vote.container.button.cancel')
            }
        ]
	}
});
Ext.define('Kort.view.validation.vote.ButtonContainer', {
	extend: 'Ext.Container',
	alias: 'widget.votebuttoncontainer',
    requires: [
        'Ext.Button'
    ],
	
	config: {
        cls: 'voteButtonContainer',
        layout: 'vbox',
        defaults: {
            xtype: 'button',
            iconMask: true
        },
        
        items: [
            {
                ui: 'confirm',
                cls: 'voteConfirmButton',
                iconCls: 'add_black',
                text: Ext.i18n.Bundle.message('vote.container.button.accept')
            },
            {
                ui: 'decline',
                cls: 'voteDeclineButton',
                iconCls: 'minus_black1',
                text: Ext.i18n.Bundle.message('vote.container.button.decline')
            },
            {
                cls: 'voteCancelButton',
                iconCls: 'arrow_left',
                text: Ext.i18n.Bundle.message('vote.container.button.cancel')
            }
        ]
	}
});
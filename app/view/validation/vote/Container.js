Ext.define('Kort.view.validation.vote.Container', {
	extend: 'Ext.Container',
	alias: 'widget.votecontainer',
    requires: [
        'Ext.Button',
        'Kort.view.validation.vote.ButtonContainer'
    ],
	
	config: {
        cls: 'voteContainer',
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        title: Ext.i18n.Bundle.message('vote.container.title')
	},
    
    initialize: function () {
        var voteContentContainer,
            buttonContainer;

        this.callParent(arguments);
        
        voteContentContainer = {
            xtype: 'component',
            cls: 'voteContent',
            record: this.getRecord(),
            tpl:    new Ext.XTemplate(
                        '<div class="vote-content">',
                            '<div class="description">',
                                '{description}',
                            '</div>',
                            '<div class="fixmessage">',
                                '{fixmessage}',
                            '</div>',
                        '</div>'
                    )
        };
        
        buttonContainer = {
            xtype: 'votebuttoncontainer'
        };
        
        this.add([voteContentContainer, buttonContainer]);
    }
});
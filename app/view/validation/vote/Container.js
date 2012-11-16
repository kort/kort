Ext.define('Kort.view.validation.vote.Container', {
	extend: 'Ext.Container',
	alias: 'widget.votecontainer',
    requires: [
        'Ext.Button'
    ],
	
	config: {
        cls: 'voteContainer',
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
        fullscreen: true,
        title: Ext.i18n.Bundle.message('vote.container.title')
	},
    
    initialize: function () {
        this.callParent(arguments);
        
        var voteContentContainer = {
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
        
        this.add(voteContentContainer);
    }
});
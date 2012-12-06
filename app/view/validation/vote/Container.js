Ext.define('Kort.view.validation.vote.Container', {
	extend: 'Ext.Container',
	alias: 'widget.votecontainer',
    requires: [
        'Kort.view.LeafletMap',
        'Ext.Button'
    ],
	
	config: {
        cls: 'voteContainer',
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
        layout: 'vbox'
	},
    
    initialize: function () {
        var me = this,
            selectAnswersStore = Ext.getStore('SelectAnswers'),
            voteContentContainer,
            voteMap,
            voteAnswerButton,
            fixmessage = me.getRecord().get('fixmessage');

        this.callParent(arguments);
        
        // replace fixmessage with title if select view type given
        if(this.getRecord().get('view_type') === 'select') {
            // filter answers for given type
            selectAnswersStore.filter('type', this.getRecord().get('type'));
            selectAnswersStore.each(function(item, index, length) {
                if(item.get('value') === me.getRecord().get('fixmessage')) {
                    fixmessage = item.get('title');
                }
            });
        }
        
        voteContentContainer = {
            xtype: 'component',
            cls: 'voteContent',
            record: this.getRecord(),
            tpl:    new Ext.XTemplate(
                        '<div class="vote-content">',
                            '<div class="question">',
                                '{question}',
                            '</div>',
                            '<div class="fixmessage">',
                                fixmessage,
                            '</div>',
                        '</div>'
                    )
        };
        
        voteMap = {
            xtype: 'kortleafletmap',
            cls: 'voteMap',
            flex: 1,
            mapOptions: {
                dragging: false
            }
        };
        
        voteAnswerButton = {
            xtype: 'button',
            iconMask: true,
            ui: 'confirm',
            cls: 'voteAnswerButton',
            text: Ext.i18n.Bundle.message('vote.container.button.answer')
        };
        
        this.add([voteContentContainer, voteMap, voteAnswerButton]);
    }
});
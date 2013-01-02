/**
 * Main container for vote view
 */
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
            validationRecord = me.getRecord(),
            fixmessage = validationRecord.get('fixmessage'),
            question = validationRecord.get('question'),
            voteContentContainer,
            voteMap,
            voteAnswerButton;

        this.callParent(arguments);
        
        if(validationRecord.get('falsepositive')) {
            fixmessage = question;
            question = Ext.i18n.Bundle.message('vote.falsepositive.question');
        } else if(validationRecord.get('view_type') === 'select') {
            // filter answers for given type
            selectAnswersStore.filter('type', validationRecord.get('type'));
            
            // replace fixmessage with title if select view type given
            selectAnswersStore.each(function(item, index, length) {
                if(item.get('value') === fixmessage) {
                    fixmessage = item.get('title');
                }
            });
        }
        
        voteContentContainer = {
            xtype: 'component',
            cls: 'voteContent',
            html:    '<div class="vote-content">' +
                        '<div class="question">' +
                            question +
                        '</div>' +
                        '<div class="fixmessage">' +
                            fixmessage +
                        '</div>' +
                    '</div>'
        };
        
        voteAnswerButton = {
            xtype: 'button',
            iconMask: true,
            ui: 'confirm',
            cls: 'voteAnswerButton',
            text: Ext.i18n.Bundle.message('vote.container.button.answer')
        };
        
        voteMap = {
            xtype: 'kortleafletmap',
            cls: 'voteMap',
            flex: 1,
            initialCenter: false,
            mapOptions: {
                dragging: false
            }
        };
        
        me.add([voteContentContainer, voteAnswerButton, voteMap]);
    }
});
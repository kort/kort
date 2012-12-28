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
            voteRecord = me.getRecord(),
            fixmessage = voteRecord.get('fixmessage'),
            voteContentContainer,
            voteMap,
            voteAnswerButton,
            voteContentTemplate;

        this.callParent(arguments);
        
        // replace fixmessage with title if select view type given
        if(this.getRecord().get('view_type') === 'select') {
            // filter answers for given type
            selectAnswersStore.filter('type', voteRecord.get('type'));
            selectAnswersStore.each(function(item, index, length) {
                if(item.get('value') === fixmessage) {
                    fixmessage = item.get('title');
                }
            });
        }
        
        if(voteRecord.get('falsepositive')) {
            voteContentTemplate = new Ext.XTemplate(
                '<div class="vote-content">',
                    '<div class="question">',
                        '{question}',
                    '</div>',
                    '<div class="fixmessage">',
                        Ext.i18n.Bundle.message('vote.falsepositive.question'),
                    '</div>',
                '</div>'
            );
        } else {
            voteContentTemplate = new Ext.XTemplate(
                '<div class="vote-content">',
                    '<div class="question">',
                        '{question}',
                    '</div>',
                    '<div class="fixmessage">',
                        fixmessage,
                    '</div>',
                '</div>'
            );
        }
        
        voteContentContainer = {
            xtype: 'component',
            cls: 'voteContent',
            record: voteRecord,
            tpl: voteContentTemplate
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
            mapOptions: {
                dragging: false
            }
        };
        
        me.add([voteContentContainer, voteAnswerButton, voteMap]);
    }
});
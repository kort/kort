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
            votesLeft = validationRecord.get('required_votes') - validationRecord.get('upratings') + validationRecord.get('downratings'),
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

        fixmessage +=   '<div class="ratings">' +
                            '<span class="upratings">' +
                                '<tpl if="upratings &gt; 0">+</tpl>' +
                                '{upratings}' +
                                '<img class="thumb" src="./resources/images/validation/thumbs-up.png" />' +
                            '</span>' +
                            '<span class="downratings">' +
                                '<tpl if="downratings &gt; 0">-</tpl>' +
                                '{downratings}' +
                                '<img class="thumb" src="./resources/images/validation/thumbs-down.png" />' +
                            '</span>' +
                            '<span class="votesLeft">' +
                                '<img src="./resources/images/validation/votes-left.png" />' +
                                votesLeft + ' ' + Ext.i18n.Bundle.message('vote.container.votes.left') +
                            '</span>' +
                        '</div>';

        voteContentContainer = {
            xtype: 'component',
            cls: 'voteContent',
            record: this.getRecord(),
            tpl:    new Ext.XTemplate(
                        '<div class="vote-content">' +
                            '<div class="question">' +
                                question +
                            '</div>' +
                            '<div class="fixmessage">' +
                                fixmessage +
                            '</div>' +
                        '</div>'
                    )
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
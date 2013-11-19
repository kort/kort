/**
 * Main container for vote view.
 */
Ext.define('Kort.view.map.validation.Container', {
	extend: 'Ext.Container',
	alias: 'widget.votecontainer',
    requires: [

    ],
	config: {
        cls: 'voteContainer',
        scrollable: {
            direction: 'vertical',
            directionLock: true
        }
	},

    /**
     * @private
     */
    initialize: function () {
        var me = this,
            selectAnswersStore = Ext.getStore('SelectAnswers'),
            validationRecord = me.getRecord(),
            fixmessage = validationRecord.get('fixmessage'),
            question = validationRecord.get('question'),
            //ToDo refactor bug->mission
            bug_question = validationRecord.get('bug_question'),
            votesLeft = validationRecord.get('required_votes') - validationRecord.get('upratings') + validationRecord.get('downratings'),
            voteContentContainer,
            voteMap,
            voteAnswerButton;

        this.callParent(arguments);

        if(validationRecord.get('falsepositive')) {
            fixmessage = bug_question;
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
                                Ext.i18n.Bundle.message('vote.container.votes.left', { 'votes_left': votesLeft }) +
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
            initialCenter: true,
            mapOptions: {
                dragging: false
            }
        };

        me.add([voteContentContainer, voteAnswerButton, voteMap]);
    }
});
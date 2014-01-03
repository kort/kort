/**
 * ActionSheet with answers for vote view.
 */
Ext.define('Kort.view.map.validation.AnswerActionSheet', {
    extend: 'Ext.ActionSheet',
    xtype: 'voteansweractionsheet',
    requires: [
        'Ext.Button'
    ],

    config: {
        zIndex: Kort.util.Config.getZIndex().overlayLeafletMap,
        cls: 'voteAnswerActionSheet',
        
        defaults: {
            iconMask: true
        },
        
        items: [
            {
                xtype: 'component',
                cls: 'answerContent',
                html: Ext.i18n.Bundle.message('vote.answeractionsheet.question')
            },
            {
                ui: 'confirm',
                cls: 'voteAnswerConfirmButton',
                iconCls: 'add2',
                text: Ext.i18n.Bundle.message('vote.answeractionsheet.button.accept')
            },
            {
                ui: 'decline',
                cls: 'voteAnswerDeclineButton',
                iconCls: 'minus',
                text: Ext.i18n.Bundle.message('vote.answeractionsheet.button.decline')
            },
            {
                cls: 'voteAnswerCancelButton',
                iconCls: 'arrow_left',
                text: Ext.i18n.Bundle.message('vote.answeractionsheet.button.cancel')
            }
        ]
    }
});

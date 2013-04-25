Ext.define('Kort.view.news.settings.AcceptedLanguagePanel', {
    extend: ('Ext.form.Panel'),
    requires: [
        'Ext.form.FieldSet'
    ],
    config: {
        id: 'newsAcceptedLanguageSettingsPanel',
        centered : true,
        scrollable:true,
        width: '90%',
        height:'70%',
        modal    : true,
        items: [
            {
                xtype: 'container',
                cls: ''
            },
            { xtype: 'spacer' },
            {
                xtype: 'fieldset',
                id: 'acceptedLanguageFieldSet',
                items: []
            },
            {
                xtype: 'toolbar',
                docked: 'bottom',
                items: [
                    { xtype: 'spacer' },

                    {
                        xtype: 'button',
                        cls: 'acceptedLanguageCancelButton',
                        text: Ext.i18n.Bundle.message('news.settings.cancel')
                    },
                    {
                        xtype: 'button',
                        cls: 'acceptedLanguageSaveButton',
                        text: Ext.i18n.Bundle.message('news.settings.save')
                    },
                    { xtype: 'spacer' }
                ]
            }
        ]
    },
    initialize: function(){
        var acceptedLanguagesByUser = Ext.getStore('UserLocal').getData().all[0].get('newsAcceptedLanguageArray');
        var fieldset = Ext.getCmp('acceptedLanguageFieldSet');
        Kort.util.Config.getSupportedLanguages().forEach(function(element,index,array){
            fieldset.add({
               xtype: 'checkboxfield',
                name: element,
                label: Ext.i18n.Bundle.message(element),
                labelWidth: '70%',
                value: element,
                checked: acceptedLanguagesByUser.indexOf(element)!=-1
           })
        });
        /*
        fieldset.getItems().items.forEach(function(item) {
            item.setChecked(false);
        }));
        */
    }
});

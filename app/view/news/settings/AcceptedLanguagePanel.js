/**
 * News settings panel.
 */
Ext.define('Kort.view.news.settings.AcceptedLanguagePanel', {
    extend: 'Ext.form.Panel',
    requires: [
        'Ext.form.FieldSet',
        'Ext.Label',
        'Ext.Toolbar',
        'Ext.field.Checkbox'
    ],
    config: {
        id: 'newsSettingsPanel',
        centered : true,
        scrollable:true,
        width: '95%',
        height:'95%',
        modal    : true,
        items: [
            {
                xtype: 'toolbar',
                docked: 'top',
                cls: 'newsSettingsTitle',
                items:[
                    {
                        xtype: 'label',
                        html: Ext.i18n.Bundle.message('news.settings.label')
                    }
                ]
            },
            {
                xtype: 'toolbar',
                docked: 'top',
                cls: 'newsSettingsSelectionToolbar',
                items: [
                    { xtype: 'spacer' },
                    {
                        xtype: 'button',
                        cls: 'newsSettingsSelectAllLanguagesButton',
                        text: Ext.i18n.Bundle.message('news.settings.acceptAllLanguages')
                    },
                    {
                        xtype: 'button',
                        cls: 'newsSettingsClearAllLanguagesButton',
                        text: Ext.i18n.Bundle.message('news.settings.acceptNoLanguage')
                    },
                    { xtype: 'spacer' }
                ]
            },
            {
                xtype: 'fieldset',
                id: 'acceptedLanguageFieldSet',
                items: []
            },
            {
                xtype: 'toolbar',
                docked: 'bottom',
                cls: 'newsSettingsBottomToolbar',
                items: [
                    { xtype: 'spacer' },

                    {
                        xtype: 'button',
                        cls: 'newsSettingsCancelButton',
                        text: Ext.i18n.Bundle.message('news.settings.cancel')
                    },
                    {
                        xtype: 'button',
                        cls: 'newsSettingsSaveButton',
                        text: Ext.i18n.Bundle.message('news.settings.save')
                    },
                    { xtype: 'spacer' }
                ]
            }
        ]

    },

    /**
     * @private
     */
    initialize: function(){

        var acceptedLanguagesByUser = Ext.getStore('UserLocal').getData().all[0].get('newsAcceptedLanguageArray'),
            fieldset = Ext.getCmp('acceptedLanguageFieldSet');
        Kort.util.Config.getSupportedLanguages().forEach(function(element,index,array){
            fieldset.add({
               xtype: 'checkboxfield',
                name: element,
                label: Ext.i18n.Bundle.message(element),
                labelWidth: '70%',
                value: element,
                checked: acceptedLanguagesByUser.indexOf(element)!==-1
           });
        });

    }

});

Ext.define('Kort.view.bugmap.fix.Form', {
	extend: 'Ext.Container',
	alias: 'widget.fixform',
    requires: [
        'Ext.form.Panel',
        'Ext.Button',
        'Ext.field.Select',
        'Ext.field.Number',
        'Ext.field.Text'
    ],
    
	config: {
		layout: 'vbox',
        cls: 'fixform',
        scrollable: true,
        title: Ext.i18n.Bundle.message('fix.form.title'),
        fullscreen: true
	},
    
    initialize: function () {
        var fixContentComponent,
            fixFormPanel,
            fixField;
        
        this.callParent(arguments);
        
        fixContentComponent = {
            xtype: 'component',
            cls: 'fixContentComponent',
            record: this.getRecord(),
            tpl:    new Ext.Template(
                        '<div class="fix-content">',
                            '<div class="description">',
                                '<div class="image">',
                                    '<img class="bugtype-image" src="./resources/images/marker_icons/{type}.png" />',
                                '</div>',
                                '<div class="content">',
                                    '<p>{description}</p>',
                                '</div>',
                            '</div>',
                        '</div>'
                    )
        };
        
        fixField = this.createFixField(this.getRecord());
        
        fixFormPanel = {
            xtype: 'formpanel',
            scrollable: false,
            flex: 1,
            items: [
                fixField,
                {
                    xtype: 'button',
                    cls: 'fixSubmitButton',
                    ui: 'confirm',
                    id: 'fixFormSubmitButton',
                    text: Ext.i18n.Bundle.message('fix.form.button.submit')
                }
            ]
        };
        
        this.add([fixContentComponent, fixFormPanel]);
    },
    
    createFixField: function(bug) {
        var fixField,
            fieldConfig = {
                name: 'fixfield',
                cls: 'fixfield'
            },
            tracktypesStore;
        
        if(bug.get('view_type') === 'select') {
            tracktypesStore = Ext.getStore('Tracktypes');
            fieldConfig = Ext.merge(fieldConfig, {
                store: tracktypesStore,
                // always use Ext.picker.Picker
                usePicker: true,
                valueField: 'type_key',
                displayField: 'title',
                defaultPhonePickerConfig: {
                    cancelButton: Ext.i18n.Bundle.message('picker.cancel'),
                    doneButton: Ext.i18n.Bundle.message('picker.done')
                },
                defaultTabletPickerConfig: {
                    cancelButton: Ext.i18n.Bundle.message('picker.cancel'),
                    doneButton: Ext.i18n.Bundle.message('picker.done')
                }
            });
            
            fixField = Ext.create('Ext.field.Select', fieldConfig);
        } else if(bug.get('view_type') === 'number') {
            fixField = Ext.create('Ext.field.Number', fieldConfig);
        } else {
            fixField = Ext.create('Ext.field.Text', fieldConfig);
        }
        
        // TODO i18n bundle doens't work for placeholders
        fixField.setPlaceHolder(this.getRecord().get('answer_placeholder'));
        
        return fixField;
    }
});

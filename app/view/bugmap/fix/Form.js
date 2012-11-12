Ext.define('Kort.view.bugmap.fix.Form', {
	extend: 'Ext.Container',
	alias: 'widget.fixform',
    
	config: {
		layout: 'vbox',
        scrollable: true,
        title: Ext.i18n.Bundle.message('fix.form.title'),
        fullscreen: true
	},
    
    initialize: function () {
        var fixContentComponent,
            fixForm,
            fixField;
        
        this.callParent(arguments);
        
        fixContentComponent = {
            xtype: 'component',
            id: 'fixContentComponent',
            record: this.getRecord(),
            tpl:    new Ext.Template(
                        '{description}'
                    )
        };
        
        fixField = this.createFixField(this.getRecord());
        
        fixForm = {
            xtype: 'formpanel',
            id: 'fixform',
            scrollable: false,
            flex: 1,
            items: [
                fixField,
                {
                    xtype: 'button',
                    ui: 'confirm',
                    id: 'fixFormSubmitButton',
                    text: Ext.i18n.Bundle.message('fix.form.button.submit')
                }
            ]
        };
        
        this.add([fixContentComponent, fixForm]);
    },
    
    createFixField: function(bug) {
        var fixField,
            fieldConfig = {
                id: 'fixfield',
                name: 'fixfield'
            };
        
        if(bug.get('view_type') === 'select') {
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

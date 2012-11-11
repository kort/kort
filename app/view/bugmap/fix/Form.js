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
            fixForm;
        
        this.callParent(arguments);
        
        fixContentComponent = {
            xtype: 'component',
            id: 'fixContentComponent',
            record: this.getRecord(),
            tpl:    new Ext.Template(
                        '{description}'
                    )
        };
        
        fixForm = {
            xtype: 'formpanel',
            id: 'fixform',
            scrollable: false,
            flex: 1,
            items: [
                {
                    xtype: 'textfield',
                    cls: 'fixmessageTextField',
                    name: 'fixmessage',
                    // TODO i18n bundle doens't work for placeholders
                    placeHolder: 'Deine Antwort'
                },
                {
                    xtype: 'button',
                    ui: 'confirm',
                    id: 'fixFormSubmitButton',
                    text: Ext.i18n.Bundle.message('fix.form.button.submit')
                }
            ]
        };
        
        this.add([fixContentComponent, fixForm]);
    }
});

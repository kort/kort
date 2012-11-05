Ext.define('Kort.view.bugmap.fix.Form', {
	extend: 'Ext.Container',
	alias: 'widget.fixform',
    
	config: {
		layout: 'vbox',
        title: Ext.i18n.Bundle.message('fix.form.title'),
        fullscreen: true,
        bugdata: null,
        
        items: [
            {
                html: ''
            },
            {
                xtype: 'formpanel',
                id: 'taskform',
                flex: 1,
                items: [
                    {
                        xtype: 'textfield',
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
            }
        ]
	}
});

Ext.define('Kort.view.bugmap.fix.FormContainer', {
	extend: 'Ext.Container',
	alias: 'widget.fixformcontainer',
    
	config: {
		layout: 'vbox',
        title: Ext.i18n.Bundle.message('fix.form.title'),
        fullscreen: true,
        id: 'fixFormContainer',
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
                        placeHolder: 'Deine Antwort...'
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

Ext.define('Kort.view.task.FormContainer', {
	extend: 'Ext.Container',
	alias: 'widget.taskformcontainer',
    
	config: {
		layout: 'vbox',
        title: 'Fix',
        fullscreen: true,
        
        listeners: {
            initialize: 'onInitialize'
        },
        
        items: [
            {
                html: ''
            },
            {
                xtype: 'formpanel',
                flex: 1,
                items: [
                    {
                        xtype: 'textfield',
                        name: 'message',
                        requires: true,
                        label: Ext.i18n.Bundle.message('bugdetail.field.message')
                    },
                    {
                        xtype: 'button',
                        ui: 'confirm',
                        id: 'fixSubmitButton',
                        text: Ext.i18n.Bundle.message('bugdetail.button.submit')
                    }
                ]
            }
        ]
	},
    
    onInitialize: function() {
        //this.getItems().items[0].setHtml(this.getBugdata().get('description'));
    }
});
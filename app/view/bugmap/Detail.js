Ext.define('Kort.view.bugmap.Detail', {
	extend: 'Ext.Container',
	alias: 'widget.bugdetail',
    
	config: {
		layout: 'vbox',
        title: '',
        fullscreen: true,
        bugdata: null,
        
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
        this.setTitle(this.getBugdata().get('title'));
        this.getItems().items[0].setHtml(this.getBugdata().get('description'));
    }
});
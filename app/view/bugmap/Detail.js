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
                        name: 'streetname',
                        label: Ext.i18n.Bundle.message('bugdetail.field.streetname')
                    },
                    {
                        xtype: 'button',
                        ui: 'confirm',
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
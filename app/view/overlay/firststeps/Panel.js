Ext.define('Kort.view.overlay.firststeps.Panel', {
	extend: 'Ext.Panel',
	alias: 'widget.firststepspanel',
    requires: [
        'Ext.form.Panel',
        'Ext.Button',
        'Ext.field.Text'
    ],

	config: {
		id: 'firststepsPanel',
		layout: 'vbox',
        modal: true,
        scrollable: true,
        cls: 'overlayLeafletMap',
        
        showAnimation: {
            type: 'slideIn',
            direction: 'down'
        },
        hideAnimation: {
            type: 'slideOut',
            direction: 'up'
        },
        
		items: [
			{
                html:   '<div class="overlay-content">' +
                            '<div class="logo">' +
                                '<img src="./resources/images/kort-logo.png" />' +
                            '</div>' +
                            '<div class="introduction">' +
                                Ext.i18n.Bundle.message('firststeps.introduction.1') +
                                Kort.util.Config.getKortTitle() +
                                Ext.i18n.Bundle.message('firststeps.introduction.2') +
                            '</div>' +
                        '</div>'
			},
            {
                xtype: 'formpanel',
                id: 'usernameForm',
                scrollable: false,
                layout: 'vbox',
                items: [
                    {
                        xtype: 'textfield',
                        cls: 'usernameTextfield',
                        name: 'username',
                        // TODO i18n bundle doens't work for placeholders
                        placeHolder: 'Benutzername'
                    },
                    {
                        xtype: 'button',
                        ui: 'confirm',
                        id: 'firststepsFormSubmitButton',
                        text: Ext.i18n.Bundle.message('firststeps.form.button.submit')
                    }
                ]
            }
		]
	}
});
Ext.define('Kort.view.overlay.firststeps.Panel', {
	extend: 'Ext.Panel',
	alias: 'widget.firststepspanel',

	config: {
		url: 'firststeps',
		id: 'firststepsPanel',
		layout: 'vbox',
        modal: true,
        cls: 'overlayLeafletMap',
		items: [
			{
                html:   '<div class="overlay-content">' +
                            '<div class="logo">' +
                                '<img src="./resources/images/kort-logo.png" />' +
                            '</div>' +
                            '<div class="introduction">' +
                                Ext.i18n.Bundle.message('firststeps.introduction') +
                            '</div>' +
                        '</div>'
			},
            {
                xtype: 'formpanel',
                id: 'usernameForm',
                flex: 1,
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
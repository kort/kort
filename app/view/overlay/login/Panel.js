Ext.define('Kort.view.overlay.login.Panel', {
	extend: 'Ext.Panel',
	alias: 'widget.loginpanel',
    requires: [
        'Ext.Button'
    ],

	config: {
		url: 'login',
		id: 'loginPanel',
		layout: 'vbox',
        modal: true,
        scrollable: true,
        cls: 'overlayLeafletMap',
		items: [
			{
                html:   '<div class="overlay-content">' +
                            '<div class="logo">' +
                                '<img src="./resources/images/kort-logo.png" />' +
                            '</div>' +
                            '<div class="introduction">' +
                                Ext.i18n.Bundle.message('login.introduction') +
                            '</div>' +
                        '</div>'
			},
            {
                xtype: 'container',
                layout: 'vbox',
                scrollable: false,
                cls: 'loginButtons',
                items: [
                    {
                        xtype: 'button',
                        text: Ext.i18n.Bundle.message('login.button.google'),
                        id: 'loginButtonGoogle',
                        baseCls: Ext.baseCSSPrefix + 'zocial-button',
                        cls: 'zocial google'
                    },
                    {
                        xtype: 'button',
                        text: Ext.i18n.Bundle.message('login.button.twitter'),
                        id: 'loginButtonTwitter',
                        baseCls: Ext.baseCSSPrefix + 'zocial-button',
                        cls: 'zocial twitter'
                    }
                ]
            }
		]
	}
});
/**
 * Login panel which overlays main panel if user isn't logged in.
 */
Ext.define('Kort.view.overlay.login.Panel', {
	extend: 'Ext.Panel',
	alias: 'widget.loginpanel',
    requires: [
        'Ext.Button'
    ],

	config: {
		id: 'loginPanel',
        modal: true,
        scrollable: true,
        cls: 'overlayLeafletMap',
		items: [
            {
                html:   '<div class="overlay-content">' +
                            '<div class="logo">' +
                                '<img src="./resources/images/kort-logo.png" />' +
                            '</div>' +
                            '<ul class="kort-description">' +
                                '<li>' + Ext.i18n.Bundle.message('login.kort.description.1') + '</li>' +
                                '<li>' + Ext.i18n.Bundle.message('login.kort.description.2') + '</li>' +
                                '<li>' + Ext.i18n.Bundle.message('login.kort.description.3') + '</li>' +
                            '</ul>' +
                            '<div class="introduction">' +
                                '<p>' + Ext.i18n.Bundle.message('login.kort.introduction.1') + '</p>' +
                                '<p>' + Ext.i18n.Bundle.message('login.kort.introduction.2') + '</p>' +
                                '<p>' + Ext.i18n.Bundle.message('login.kort.introduction.3') + '</p>' +
                                '<p class="important">' + Ext.i18n.Bundle.message('login.kort.introduction.4') + '</p>' +
                            '</div>' +
                        '</div>'
            },
            {
                xtype: 'container',
                layout: 'vbox',
                scrollable: null,
                cls: 'loginButtons',
                items: [
                    {
                        xtype: 'button',
                        text: Ext.i18n.Bundle.message('login.button.osm'),
                        id: 'loginButtonOsm',
                        baseCls: Ext.baseCSSPrefix + 'zocial-button',
                        cls: 'zocial pinboard'
                    },
                    {
                        xtype: 'button',
                        text: Ext.i18n.Bundle.message('login.button.google'),
                        id: 'loginButtonGoogle',
                        baseCls: Ext.baseCSSPrefix + 'zocial-button',
                        cls: 'zocial google'
                    },
                    {
                        xtype: 'button',
                        text: Ext.i18n.Bundle.message('login.button.facebook'),
                        id: 'loginButtonFacebook',
                        baseCls: Ext.baseCSSPrefix + 'zocial-button',
                        cls: 'zocial facebook'
                    }
                ]
            }
		]
	}
});
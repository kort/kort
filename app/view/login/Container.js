Ext.define('Kort.view.login.Container', {
	extend: 'Ext.Container',
	alias: 'widget.logincontainer',
    requires: [
        'Ext.TitleBar'
    ],

	config: {
		title: Ext.i18n.Bundle.message('login.title'),
		url: 'login',
		id: 'loginContainer',
		iconCls: 'nuclear',
		layout: 'vbox',
		items: [
			{
				xtype: 'titlebar',
				cls: 'titlebar',
				docked: 'top',
				title: Ext.i18n.Bundle.message('login.title')
			},
			{
                html: Ext.i18n.Bundle.message('login.introduction')
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
                text: Ext.i18n.Bundle.message('login.button.twitter'),
                id: 'loginButtonTwitter',
                baseCls: Ext.baseCSSPrefix + 'zocial-button',
                cls: 'zocial twitter'
            }
		]
	}
});
Ext.define('Kort.view.login.Sheet', {
	extend: 'Ext.Sheet',
	alias: 'widget.loginsheet',

	config: {
		url: 'login',
		id: 'loginSheet',
		layout: 'vbox',
		items: [
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
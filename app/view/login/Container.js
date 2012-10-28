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
                text: 'Login with Google',
                id: 'loginButton'
            }
		]
	}
});
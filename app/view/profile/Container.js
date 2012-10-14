Ext.define('Kort.view.profile.Container', {
	extend: 'Ext.Container',
	alias: 'widget.profilecontainer',
    requires: [,
        'Ext.TitleBar'
    ],
	
	config: {
		title: 'Profil',
		url: 'profile',
		id: 'profileContainer',
		iconCls: 'user',
		layout: 'fit',
		items: [
			{
				xtype: 'titlebar',
				cls: 'titlebar',
				docked: 'top',
				title: 'Profil'
			},
			{
                html: 'Dies ist dein Profil'
			}
		]
	}
});
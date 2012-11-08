Ext.define('Kort.view.profile.Container', {
	extend: 'Ext.Container',
	alias: 'widget.profilecontainer',
    requires: [
        'Ext.TitleBar'
    ],
	
	config: {
		title: Ext.i18n.Bundle.message('tab.profile'),
		url: 'profile',
		id: 'profileContainer',
		iconCls: 'user',
		layout: 'fit',
        
		items: [
			{
				xtype: 'titlebar',
				cls: 'titlebar',
				docked: 'top',
				title: Ext.i18n.Bundle.message('profile.title'),
                
                items: [
                    {
                        text: 'Logout',
                        align: 'right',
                        ui: 'decline',
                        id: 'logoutButton'
                    }
                ]
			}
		]
	},
    initialize: function () {
        this.callParent(arguments);

        var profileContentContainer = {
            xtype: 'component',
            id: 'profileContentContainer',
            tpl: new Ext.Template(
                '<div class=class="userprofile">',
                    '<div class="picture">',
                        '<img src="{picUrl}" />',
                    '</div>',
                    '<dl class="content">',
                        '<dt>' + Ext.i18n.Bundle.message('profile.content.username') + '</dt>',
                        '<dd>{username}</dd>',
                        '<dt>' + Ext.i18n.Bundle.message('profile.content.email') + '</dt>',
                        '<dd>{email}</dd>',
                    '</dl>',
                '</div>'
                )
        };
        
        this.add(profileContentContainer);
    }
});
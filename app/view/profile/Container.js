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
        scrollable: true,
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
            tpl: new Ext.XTemplate(
                '<div class="profile-content">',
                    '<div class="info">',
                        '<div class="picture">',
                            '<img src="{picUrl}" />',
                        '</div>',
                        '<dl class="text">',
                            '<dt>' + Ext.i18n.Bundle.message('profile.content.username') + '</dt>',
                            '<dd>{username}</dd>',
                            '<dt>' + Ext.i18n.Bundle.message('profile.content.email') + '</dt>',
                            '<dd>{email}</dd>',
                            '<dt>' + Ext.i18n.Bundle.message('profile.content.fixes') + '</dt>',
                            '<dd>{fixCount}</dd>',
                            '<dt>' + Ext.i18n.Bundle.message('profile.content.verifications') + '</dt>',
                            '<dd>{verificationCount}</dd>',
                        '</dl>',
                    '</div>',
                    // TODO small hack to recieve sencha list header styling
                    '<div class="profile-header x-list-normal">',
                        '<div class="x-list-header">' + Ext.i18n.Bundle.message('profile.content.korts.header') + '</div>',
                    '</div>',
                    '<div class="korts">',
                        '<span class="korts-introduction">' + Ext.i18n.Bundle.message('profile.content.korts.introduction') + '</span>',
                        '<span class="korts-number">{kortsCount}</span>',
                    '</div>',
                    // TODO small hack to recieve sencha list header styling
                    '<div class="profile-header x-list-normal">',
                        '<div class="x-list-header">' + Ext.i18n.Bundle.message('profile.content.badges.header') + '</div>',
                    '</div>',
                    '<div class="badges">',
                        'Hier kommen deine Badges!',
                    '</div>',
                '</div>'
                )
        };
        
        this.add(profileContentContainer);
    }
});
Ext.define('Kort.view.profile.Container', {
	extend: 'Ext.Container',
	alias: 'widget.profilecontainer',
    requires: [
        'Ext.TitleBar',
        'Ext.Button'
    ],
	
	config: {
		title: Ext.i18n.Bundle.message('tab.profile'),
		url: 'profile',
		id: 'profileContainer',
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
		iconCls: 'user',
		layout: 'vbox',
        
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

        var profileContentComponent = {
            xtype: 'component',
            id: 'profileContentComponent',
            tpl: new Ext.XTemplate(
                '<div class="profile-content">',
                    '<div class="info">',
                        '<div class="picture">',
                            '<img src="{picUrl}" />',
                        '</div>',
                        '<dl class="kort-definitionlist text">',
                            '<dt>' + Ext.i18n.Bundle.message('profile.content.username') + '</dt>',
                            '<dd>{username}</dd>',
                            '<dt>' + Ext.i18n.Bundle.message('profile.content.email') + '</dt>',
                            '<dd>{email}</dd>',
                            '<dt>' + Ext.i18n.Bundle.message('profile.content.fixes') + '</dt>',
                            '<dd>{fixCount}</dd>',
                            '<dt>' + Ext.i18n.Bundle.message('profile.content.validations') + '</dt>',
                            '<dd>{validationCount}</dd>',
                        '</dl>',
                    '</div>',
                    // TODO small hack to recieve sencha list header styling
                    '<div class="profile-header x-list-normal">',
                        '<div class="x-list-header">' + Ext.i18n.Bundle.message('profile.content.koins.header') + '</div>',
                    '</div>',
                    '<div class="koins">',
                        '<span class="koins-introduction">' + Ext.i18n.Bundle.message('profile.content.koins.introduction') + '</span>',
                        '<span class="kort-label koins-number">{koinCount}</span>',
                    '</div>',
                    // TODO small hack to recieve sencha list header styling
                    '<div class="profile-header x-list-normal">',
                        '<div class="x-list-header">' + Ext.i18n.Bundle.message('profile.content.badges.header') + '</div>',
                    '</div>',
                    '<div class="badges">',
                        '<tpl for="badges">',
                            '<div class="badge">',
                                '<img src="./resources/images/badges/<tpl if="won">{name}<tpl else>locked</tpl>.png" />',
                                '<p class="badge-title">{name}</p>',
                            '</div>',
                        '</tpl>',
                    '</div>',
                '</div>'
                )
        };
        
        this.add(profileContentComponent);
    }
});
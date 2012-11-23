Ext.define('Kort.view.profile.ContentComponent', {
	extend: 'Ext.Component',
	alias: 'widget.profilecontentcomponent',
	
	config: {
        cls: 'profileContentComponent',
        
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
                '</div>'
            )
	}
});
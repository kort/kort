/**
 * Component which shows user content
 */
Ext.define('Kort.view.profile.ContentComponent', {
	extend: 'Ext.Component',
	alias: 'widget.profilecontentcomponent',
	
	config: {
        cls: 'profileContentComponent',
        
        tpl: new Ext.XTemplate(
                '<div class="profile-content">',
                    '<div class="info">',
                        '<div class="picture">',
                            '<img src="{pic_url}" />',
                        '</div>',
                        '<dl class="kort-definitionlist text">',
                            '<dt>' + Ext.i18n.Bundle.message('profile.content.username') + '</dt>',
                            '<dd>{username}</dd>',
                            '<dt>' + Ext.i18n.Bundle.message('profile.content.oauthprovider') + '</dt>',
                            '<dd>{oauth_provider}</dd>',
                            '<dt>' + Ext.i18n.Bundle.message('profile.content.fixes') + '</dt>',
                            '<dd>{fix_count}</dd>',
                            '<dt>' + Ext.i18n.Bundle.message('profile.content.votes') + '</dt>',
                            '<dd>{vote_count}</dd>',
                        '</dl>',
                    '</div>',
                    // add divs with sencha classes to recieve sencha list header styling
                    '<div class="profile-header x-list-normal">',
                        '<div class="x-list-header">' + Ext.i18n.Bundle.message('profile.content.koins.header') + '</div>',
                    '</div>',
                    '<div class="koins">',
                        '<div class="koins-image"><img src="./resources/images/koins/koin_no_value.png" /></div>',
                        '<div class="koins-info">',
                            '<span class="koins-number">{koin_count}</span>',
                            '<span class="koins-title">' + Ext.i18n.Bundle.message('profile.content.koins.title') + '</span>',
                        '</div>',
                    '</div>',
                    // add divs with sencha classes to recieve sencha list header styling
                    '<div class="profile-header x-list-normal">',
                        '<div class="x-list-header">' + Ext.i18n.Bundle.message('profile.content.badges.header') + '</div>',
                    '</div>',
                '</div>'
            )
	}
});
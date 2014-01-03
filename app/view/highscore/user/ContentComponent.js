/**
 * Component which shows user content.
 */
Ext.define('Kort.view.highscore.user.ContentComponent', {
	extend: 'Ext.Component',
	alias: 'widget.highscoreusercontentcomponent',
	
	config: {
        cls: 'highscoreUserContentComponent',
        
        tpl: new Ext.XTemplate(
                '<div class="user-content">',
                    '<div class="info">',
                        '<div class="picture">',
                            '<img src="{pic_url}" />',
                        '</div>',
                        '<dl class="kort-definitionlist text">',
                            '<dt>' + Ext.i18n.Bundle.message('profile.content.username') + '</dt>',
                            '<dd>{username}</dd>',
                            '<dt>' + Ext.i18n.Bundle.message('profile.content.fixes') + '</dt>',
                            '<dd>{fix_count}</dd>',
                            '<dt>' + Ext.i18n.Bundle.message('profile.content.votes') + '</dt>',
                            '<dd>{vote_count}</dd>',
                        '</dl>',
                    '</div>',
                    '<div class="user-header">',
                        '<div class="header-content">'+ Ext.i18n.Bundle.message('profile.content.koins.header') + '</div>',
                    '</div>',
                    '<div class="koins">',
                        '<div class="koins-image"><img src="./resources/images/koins/koin_no_value.png" /></div>',
                        '<div class="koins-info">',
                            '<span class="value">{koin_count}</span>',
                            '<span class="text">' + Ext.i18n.Bundle.message('profile.content.koins.title') + '</span>',
                        '</div>',
                    '</div>',
                    '<tpl if="ranking">',
                        '<div class="ranking">',
                            '<div class="ranking-image"><img src="./resources/images/profile/highscore.png" /></div>',
                            '<div class="ranking-info">',
                                '<span class="value">{ranking}.</span>',
                                '<span class="text">' + Ext.i18n.Bundle.message('profile.content.ranking.title') + '</span>',
                            '</div>',
                        '</div>',
                    '</tpl>',
                    '<div class="user-header">',
                        '<div class="header-content">'+ Ext.i18n.Bundle.message('profile.content.badges.header') + '</div>',
                    '</div>',
                '</div>'
            )
	}
});
Ext.define('Kort.view.profile.BadgesDataView', {
	extend: 'Ext.DataView',
	alias: 'widget.profilebadgesdataview',
	
	config: {
        cls: 'profileBadgesDataView',
        store: 'UserBadges',
        inline: true,
        itemTpl:    '<div class="badge">' +
                        '<img src="./resources/images/badges/<tpl if="won">{name}<tpl else>locked</tpl>.png" />' +
                        '<p class="badge-title">{title}</p>' +
                    '</div>',
        scrollable: false,
        emptyText: '<div class="emptytext">' + Ext.i18n.Bundle.message('profile.badges.emptytext') + '</div>',
        // disable loading mask for badges dataview
        loadingText: false
	}
});
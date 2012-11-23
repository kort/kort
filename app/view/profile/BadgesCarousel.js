Ext.define('Kort.view.profile.BadgesCarousel', {
	extend: 'Ext.Carousel',
	alias: 'widget.badgescarousel',
	
	config: {
        flex: 1,
        cls: 'profileBadgesCarousel',
        itemTpl: new Ext.XTemplate(
                    '<div class="carouselitem-content">' +
                        '<h1 class="badge-title">{title}</h1>' +
                        '<img class="badge-image" src="./resources/images/badges/<tpl if="won">{name}<tpl else>locked</tpl>.png" />' +
                        '<p class="badge-description">{description}</p>' +
                    '</div>'
                )
	},
    
    initialize: function() {
        this.callParent(arguments);
        
        var me = this,
            userBadgesStore = Ext.getStore('UserBadges');
        
        userBadgesStore.each(function (badge, index, length) {
            me.add({
                html: me.getItemTpl().apply(badge.data)
            });
        });
    }
});
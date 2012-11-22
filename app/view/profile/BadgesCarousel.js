Ext.define('Kort.view.profile.BadgesCarousel', {
	extend: 'Ext.Carousel',
	alias: 'widget.badgescarousel',
	
	config: {
        flex: 1,
        itemTpl: new Ext.XTemplate(
                    '<div class="carouselitem-content">' +
                        '<img src="./resources/images/badges/<tpl if="won">{name}<tpl else>locked</tpl>.png" />' +
                        '<p class="badge-title">{name}</p>' +
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
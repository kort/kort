Ext.define('Kort.view.profile.BadgesCarousel', {
	extend: 'Ext.Carousel',
	alias: 'widget.badgescarousel',
	
	config: {
        flex: 1,
        cls: 'profileBadgesCarousel',
        selectedBadgeIndex: 0,
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
            var component = {
                xtype: 'component',
                html: me.getItemTpl().apply(badge.data)
            };
            // if user owns badge set badge background color
            if(badge.get('won')) {
                component.style = {
                    'background-color': badge.get('color')
                };
            }
            
            me.add(component);
        });
        // show choosen badge
        me.setActiveItem(me.getSelectedBadgeIndex());
    }
});
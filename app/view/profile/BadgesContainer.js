/**
 * Badges container which overlays profile when a badge gets tapped.
 */
Ext.define('Kort.view.profile.BadgesContainer', {
	extend: 'Ext.Container',
	alias: 'widget.badgescontainer',
    
    requires: [
        'Ext.TitleBar',
        'Ext.Button',
        'Kort.view.profile.BadgesCarousel'
    ],
	
	config: {
        zIndex: Kort.util.Config.getZIndex().overlayLeafletMap,
        layout: 'vbox',

        hidden: true,
        showAnimation: {
            type: 'slide',
            direction: 'up'
        },
        hideAnimation: {
            type: 'slideOut',
            direction: 'down'
        },
        
		items: [
            {
				xtype: 'titlebar',
				title: Ext.i18n.Bundle.message('profile.badges.title'),
                
                items: [
                    {
                        text: Ext.i18n.Bundle.message('profile.badges.button.close'),
                        cls: 'badgesContainerBackButton',
                        ui: 'back',
                        align: 'left'
                    }
                ]
			}
		],
        
        selectedBadgeIndex: 0
	},

    /**
     * @private
     */
    initialize: function() {
        this.callParent(arguments);
        
        var badgesCarousel = {
            xtype: 'badgescarousel',
            selectedBadgeIndex: this.getSelectedBadgeIndex()
        };
        
        this.add(badgesCarousel);
    }
});
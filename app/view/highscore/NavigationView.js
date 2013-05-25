/**
 * Main navigation view for highscore tab.
 */
Ext.define('Kort.view.highscore.NavigationView', {
	extend: 'Ext.navigation.View',
	alias: 'widget.highscorenavigationview',
    requires: [
        'Ext.TitleBar',
        'Kort.view.highscore.TabPanel'
    ],
	
	config: {
		title: Ext.i18n.Bundle.message('tab.highscore'),
		url: 'highscore',
		id: 'highscoreNavigationView',
		iconCls: 'list',
        defaultBackButtonText: Ext.i18n.Bundle.message('button.back'),
        
        navigationBar: {
            items: [
                {
                    xtype: 'button',
                    cls: 'highscoreRefreshButton',
                    iconCls: 'refresh',
                    iconMask: true,
                    align: 'right'
                }
            ],
            // SENCHA TOUCH BUGFIX:
            // disable navigationBar animation because of wrong title positioning
            animation: false
        },
        
		items: [
			{
                title: Ext.i18n.Bundle.message('highscore.title'),
                xtype: 'highscoretabpanel'
			}
		]
	}
});
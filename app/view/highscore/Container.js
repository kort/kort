Ext.define('Kort.view.highscore.Container', {
	extend: 'Ext.Container',
	alias: 'widget.highscorecontainer',
    requires: [
        'Ext.TitleBar',
        'Kort.view.highscore.List'
    ],
	
	config: {
		title: Ext.i18n.Bundle.message('tab.highscore'),
		url: 'highscore',
		id: 'highscoreContainer',
		iconCls: 'list',
		layout: 'fit',
		items: [
			{
				xtype: 'titlebar',
				cls: 'titlebar',
				docked: 'top',
				title: Ext.i18n.Bundle.message('highscore.title')
			},
			{
                xtype: 'highscorelist'
			}
		]
	}
});
Ext.define('Kort.view.highscore.List', {
	extend: 'Ext.List',
	alias: 'widget.highscorelist',
    requires: [
        'Kort.plugin.PullRefresh'
    ],
    
	config: {
		layout: 'fit',
		store: 'Highscore',
        loadingText: Ext.i18n.Bundle.message('highscore.loadmask.message'),
        emptyText: Ext.i18n.Bundle.message('highscore.emptytext'),
        disableSelection: true,
        
        itemTpl:    '<div class="highscore-item">' +
                        '<div class="ranking">#{ranking}</div>' +
                        '<div class="username">{username}</div>' +
                        '<div class="kort-label koinCount">{koinCount} ' + Ext.i18n.Bundle.message('highscore.koins') + '</div>' +
                    '</div>',
        
        plugins: [
            {
                xclass: 'Kort.plugin.PullRefresh'
            }
        ]
	}
});
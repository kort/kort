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
        
        itemTpl:    new Ext.XTemplate(
                        '<div class="highscore-item' +
                        '<tpl if="ranking == 1"> firstPlace</tpl>' +
                        '<tpl if="ranking == 2"> secondPlace</tpl>' +
                        '<tpl if="ranking == 3"> thirdPlace</tpl>' +
                        '">' +
                            '<div class="ranking">#{ranking}</div>' +
                            '<div class="information">' +
                                '<div class="username">{username}</div>' +
                                '<div class="fixCount"><span class="title">' + Ext.i18n.Bundle.message('highscore.fixcount') + '</span> <span class="value">{fix_count}</span></div>' +
                                '<div class="voteCount"><span class="title">' + Ext.i18n.Bundle.message('highscore.votecount') + '</span> <span class="value">{vote_count}</span></div>' +
                            '</div>' +
                            '<div class="koins"><span class="koinCount">{koin_count}</span> <span class="title">' + Ext.i18n.Bundle.message('highscore.koins') + '</span></div>' +
                        '</div>'
                    ),
        
        plugins: [
            {
                xclass: 'Kort.plugin.PullRefresh'
            }
        ]
	}
});
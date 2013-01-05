/**
 * Highscore list
 */
Ext.define('Kort.view.highscore.List', {
	extend: 'Ext.List',
	alias: 'widget.highscorelist',
    requires: [
        'Kort.view.highscore.PullRefreshPlugin'
    ],
    
	config: {
		layout: 'fit',
		store: 'Highscore',
        loadingText: false,
        emptyText: '<div class="emptytext">' + Ext.i18n.Bundle.message('highscore.emptytext') + '</div>',
        disableSelection: true,
        
        itemTpl:    new Ext.XTemplate(
                        '<div class="highscore-item' +
                        '<tpl if="ranking == 1"> firstPlace</tpl>' +
                        '<tpl if="ranking == 2"> secondPlace</tpl>' +
                        '<tpl if="ranking == 3"> thirdPlace</tpl>' +
                        '<tpl if="you"> you</tpl>' +
                        '">' +
                            '<div class="ranking">#{ranking}</div>' +
                            '<div class="information">' +
                                '<div class="username"><span class="value">{username}<tpl if="you"></span> <span class="you">' + Ext.i18n.Bundle.message('highscore.you') + '</span></tpl></div>' +
                                '<div class="fixCount"><span class="title">' + Ext.i18n.Bundle.message('highscore.fixcount') + '</span> <span class="value">{fix_count}</span></div>' +
                                '<div class="voteCount"><span class="title">' + Ext.i18n.Bundle.message('highscore.votecount') + '</span> <span class="value">{vote_count}</span></div>' +
                            '</div>' +
                            '<div class="koins">' +
                                '<div class="title">' + Ext.i18n.Bundle.message('highscore.koins') + '</div> ' +
                                '<div class="value">{koin_count}</div>' +
                            '</div>' +
                        '</div>'
                    ),
        
        plugins: [
            {
                xclass: 'Kort.view.highscore.PullRefreshPlugin'
            }
        ]
	}
});
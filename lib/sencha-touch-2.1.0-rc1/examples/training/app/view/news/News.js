Ext.define("CrimeFinder.view.news.News", {
    extend: 'Ext.navigation.View',
    xtype: 'news',

    requires: [
        'CrimeFinder.view.news.Nav'
    ],

	config : {
		title: 'News',
        items: [
            {
                xtype: 'newsnav',
                title: 'News'
            }
        ]
    }
});



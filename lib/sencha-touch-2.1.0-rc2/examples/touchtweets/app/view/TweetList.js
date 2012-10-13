/**
* The TweetList component is a simple dataview which is used to display the
* tweets returned by the twitter search. It also has a toolbar docked at the
* top which is used in phones to display a back button.
*
* The {@link #defaultType} is a tweetlistitem.
*/
Ext.define('Twitter.view.TweetList', {
    extend: 'Ext.dataview.List',
    xtype: 'tweetlist',
    requires: [
        'Twitter.view.TweetListItem',
        'Ext.plugin.PullRefresh',
        'Ext.plugin.ListPaging'
    ],

    config: {
        ui           : 'timeline',
        defaultType  : 'tweetlistitem',
        allowDeselect: false,
        useComponents: true,
        emptyText: 'No tweets found.',

        plugins: [
            'pullrefresh',
            {
                type: 'listpaging',
                autoPaging: true
            }
        ],

        items: [
            {
                docked: 'top',
                xtype : 'toolbar',
                hidden: true,
                ui    : 'searchbar',
                items: [
                    {
                        xtype: 'button',
                        ui   : 'back',
                        text : 'Searches'
                    }
                ]
            }
        ]
    }
});

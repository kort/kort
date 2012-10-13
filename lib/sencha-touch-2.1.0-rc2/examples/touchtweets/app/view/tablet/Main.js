/**
 * The viewport is the application's shell - the parts of the UI that don't change. In the Twitter app, we only ever
 * render a single view at a time, so we use a fullscreen card layout here. The other part of the UI is the search list
 * on the left, which we add as a docked item.
 */
Ext.define('Twitter.view.tablet.Main', {
    extend: 'Twitter.view.Main',
    xtype: 'mainview',
    
    config: {
        fullscreen: true,
        layout: 'fit',
        items: [
            {
                layout: 'fit',
                docked: 'left',
                width : 250,
                cls   : 'searchcontainer',
                itemId: 'searchcontainer',
                items: [
                    {
                        docked: 'top',
                        xtype : 'searchbar'
                    },
                    {
                        xtype: 'searchlist'
                    }
                ]
            },
            {
                xtype: 'tweetlist'
            }
        ]
    }
});
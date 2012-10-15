/**
 * Demonstrates some of the many icons that are bundled with Sencha Touch 2
 */
Ext.define('Kitchensink.view.Icons', {
    extend: 'Ext.tab.Panel',

    config: {
        activeTab: 0,
        layout: {
            animation: {
                type: 'slide',
                duration: 250
            }
        },
        tabBar: {
            layout: {
                pack : 'center',
                align: 'center'
            },
            docked: 'bottom',
            scrollable: false
        },
        defaults: {
            scrollable: true
        },
        items: [
            {
                iconCls: 'info',
                title  : 'Info',
                cls    : 'card',
                html   : 'Both toolbars and tabbars have built-in, ready to use icons.<br><br><em>Sencha Touch comes with over 300 icons that can optionally be included in your app via Sass and Compass.</em>'
            },
            {
                iconCls: 'download',
                title  : 'Download',
                cls    : 'card dark',
                html   : '<span class="action">User tapped Download</span>'
            },
            {
                iconCls: 'favorites',
                title  : 'Favorites',
                cls    : 'card',
                html   : '<span class="action">User tapped Favorites</span>'
            },
            {
                iconCls: 'bookmarks',
                title  : 'Bookmarks',
                cls    : 'card dark',
                html   : '<span class="action">User tapped Bookmarks</span>'
            },
            {
                iconCls: 'more',
                title  : 'More',
                cls    : 'card',
                html   : '<span class="action">User tapped More</span>'
            },
//            {
//                iconCls: 'search',
//                title  : 'Search',
//                cls    : 'card card3',
//                html   : 'Pressed Search'
//            },
//            {
//                iconCls: 'settings',
//                title  : 'Settings',
//                cls    : 'card card3',
//                html   : 'Pressed Settings'
//            },
//            {
//                iconCls: 'team',
//                title  : 'Team',
//                cls    : 'card card3',
//                html   : 'Pressed Team'
//            },
//            {
//                iconCls: 'time',
//                title  : 'Time',
//                cls    : 'card card3',
//                html   : 'Pressed Time'
//            },
//            {
//                iconCls: 'user',
//                title  : 'User',
//                cls    : 'card card3',
//                html   : 'Pressed User'
//            },
            {
                xtype : 'toolbar',
                ui: 'neutral',
                docked: 'top',
                scrollable: false,
                defaults: {
                    iconMask: true,
                    ui      : 'plain'
                },
                items: [
                    { iconCls: 'action' },
                    { iconCls: 'add' },
//                    { iconCls: 'arrow_up' },
//                    { iconCls: 'arrow_right' },
//                    { iconCls: 'arrow_down' },
//                    { iconCls: 'arrow_left' },
                    { iconCls: 'compose' },
                    { iconCls: 'delete' },
                    { iconCls: 'refresh' },
                    { iconCls: 'reply' }
//                    { iconCls: 'search' },
//                    { iconCls: 'star' },
//                    { iconCls: 'home' },
//                    { iconCls: 'locate' },
//                    { iconCls: 'maps' },
//                    { iconCls: 'trash' }
                ],
                layout: {
                    pack : 'center',
                    align: 'center'
                }
            }
        ]
    }
});

/**
 * Demonstrates usage of the Ext.tab.Panel component with the tabBar docked to the bottom of the screen.
 * See also app/view/Tabs.js for an example with the tabBar docked to the top
 */
Ext.define('Kitchensink.view.BottomTabs', {
    extend: 'Ext.tab.Panel',

    config: {
        activeTab: 0,
        tabBar: {
            layout: {
                pack : 'center',
                align: 'center'
            },
            docked: 'bottom'
        },
        defaults: {
            scrollable: true
        },
        items: [
            {
                title    : 'About',
                html     : '<p>Docking tabs to the bottom will automatically change their style.</p>',
                iconCls  : 'info',
                cls      : 'card'
            },
            {
                title    : 'Favorites',
                html     : 'Badges <em>(like the 4, below)</em> can be added by setting <code>badgeText</code> when creating a tab or by using <code>setBadgeText()</code> on the tab later.',
                iconCls  : 'favorites',
                cls      : 'card dark',
                badgeText: '4'
            },
            {
                title    : 'Downloads',
                id       : 'tab3',
                html     : 'Badge labels will truncate if the text is wider than the tab.',
                badgeText: 'Overflow test',
                cls      : 'card',
                iconCls  : 'download'
            },
            {
                title    : 'Settings',
                html     : 'Tabbars are <code>ui:"dark"</code> by default, but also have light variants.',
                cls      : 'card dark',
                iconCls  : 'settings'
            },
            {
                title    : 'User',
                html     : '<span class="action">User tapped User</span>',
                cls      : 'card',
                iconCls  : 'user'
            }
        ]
    }
});

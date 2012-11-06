# Using TabPanels in Sencha Touch 2

[Watch the Tabs and Toolbars video](#!/video/list)

{@link Ext.tab.Panel Tab Panels} are a great way to allow the user to switch between several pages that are all full screen. Each Component in the Tab Panel gets its own Tab, which shows the Component when tapped on. Tabs can be positioned at the top or the bottom of the Tab Panel, and can optionally accept title and icon configurations.

Here's how we can set up a simple Tab Panel with tabs at the bottom. Use the controls at the top left of the example to toggle between code mode and live preview mode (you can also edit the code and see your changes in the live preview):

    @example miniphone preview
    Ext.create('Ext.TabPanel', {
        fullscreen: true,
        tabBarPosition: 'bottom',

        defaults: {
            styleHtmlContent: true
        },

        items: [
            {
                title: 'Home',
                iconCls: 'home',
                html: 'Home Screen'
            },
            {
                title: 'Contact',
                iconCls: 'user',
                html: 'Contact Screen'
            }
        ]
    });

One tab was created for each of the {@link Ext.Panel panels} defined in the items array. Each tab automatically uses the title and icon defined on the item configuration, and switches to that item when tapped on. We can also position the tab bar at the top, which makes our Tab Panel look like this:

    @example miniphone preview
    Ext.create('Ext.TabPanel', {
        fullscreen: true,

        defaults: {
            styleHtmlContent: true
        },

        items: [
            {
                title: 'Home',
                html: 'Home Screen'
            },
            {
                title: 'Contact',
                html: 'Contact Screen'
            }
        ]
    });

## Animations

Tab Panels have a default slide animation, so when you tap on a tab it will slide the new item into view. Because TabPanel uses a {@link Ext.layout.Card Card Layout} internally, we can change this by just specifying the layout's animation configuration - in this case to use 'fade':

    @example miniphone preview
    Ext.create('Ext.TabPanel', {
        fullscreen: true,

        defaults: {
            styleHtmlContent: true
        },

        layout: {
            type: 'card',
            animation: {
                type: 'fade'
            }
        },

        items: [
            {
                title: 'Home',
                html: 'Home Screen'
            },
            {
                title: 'Contact',
                html: 'Contact Screen'
            }
        ]
    });

Ext.define('Kitchensink.view.tablet.Main', {
    extend: 'Ext.Container',
    xtype: 'mainview',

    requires: [
        'Ext.dataview.NestedList',
        'Ext.navigation.Bar'
    ],

    config: {
        fullscreen: true,

        layout: {
            type: 'card',
            animation: {
                type: 'slide',
                direction: 'left',
                duration: 250
            }
        },

        items: [
            {
                id: 'launchscreen',
                cls : 'card',
                scrollable: true,
                html: '<div><h2>Welcome to Sencha Touch <span class="version">' + Ext.version +'</span></h2><div class="feature main"><img src="resources/images/circle-touch.png" width="52" height="52"><p>This is the Kitchen Sink &#8212; a collection of features and examples in an easy-to-browse format. Each example also has a &#8220;view source&#8221; button which shows how it was created.</p></div><h2>What&#8217;s new</h2><div class="feature"><img src="resources/images/circle-performance.png" width="52" height="52"><h3>Unbelievable Performance</h3><p>Faster layouts and animations, smoother scrolling, and overall more responsive.</p></div><div class="feature"><img src="resources/images/circle-architecture.png" width="52" height="52"><h3>Improved Architecture</h3><p>Our new class system is simpler to write and easier to extend. All new MVC and state-management support.</p></div><div class="feature"><img src="resources/images/circle-native.png" width="52" height="52"><h3>Native Packaging</h3><p>Sencha SDK Tools now allow you to build your app for App Store distribution, on Windows and Mac.</p></div><div class="feature"><img src="resources/images/circle-learn.png" width="52" height="52"><h3>Easy to Learn</h3><p>With over 30 new guides, 6 new full-fledged demo apps, and improved documentation, Sencha Touch 2 is easier to learn than ever.</p></div></div><footer>Learn more at <a href="http://www.sencha.com/products/touch" target="blank">sencha.com/products/touch</a></footer>'
            },
            {
                id: 'mainNestedList',
                xtype : 'nestedlist',
                useTitleAsBackText: false,
                docked: 'left',
                width : 250,
                store: 'Demos'
            },
            {
                id: 'mainNavigationBar',
                xtype : 'titlebar',
                docked: 'top',
                title : 'Kitchen Sink',
                items: {
                    xtype : 'button',
                    id: 'viewSourceButton',
                    hidden: true,
                    align : 'right',
                    ui    : 'action',
                    action: 'viewSource',
                    text  : 'Source'
                }
            }
        ]
    }
});

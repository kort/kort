Ext.application({
    name: 'Million',

    requires: [
        'Ext.MessageBox',
        'Ext.TitleBar',
        'Ext.chart.axis.Numeric',
        'Ext.chart.series.Line',
        'Ext.chart.interactions.PanZoom'
    ],

    views: ['Main'],

    stores: ['Stock'],

    icon: {
        '57': 'resources/icons/Icon.png',
        '72': 'resources/icons/Icon~ipad.png',
        '114': 'resources/icons/Icon@2x.png',
        '144': 'resources/icons/Icon~ipad@2x.png'
    },

    isIconPrecomposed: true,

    startupImage: {
        '320x460': 'resources/startup/320x460.jpg',
        '640x920': 'resources/startup/640x920.png',
        '768x1004': 'resources/startup/768x1004.png',
        '748x1024': 'resources/startup/748x1024.png',
        '1536x2008': 'resources/startup/1536x2008.png',
        '1496x2048': 'resources/startup/1496x2048.png'
    },

    launch: function () {
        // Destroy the #appLoadingIndicator element
        Ext.fly('appLoadingIndicator').destroy();
        new Million.store.Stock();
        
        Ext.Msg.confirm('Warning', 'This may take up to 1 minute to start, and may crash the browser. Ready?', function (result) {
            if (result === 'yes') {
                // Initialize the main view
                Ext.Viewport.add(Ext.create('Million.view.Main'));
            }
        });
    },

    onUpdated: function () {
        Ext.Msg.confirm(
            "Application Update",
            "This application has just successfully been updated to the latest version. Reload now?",
            function (buttonId) {
                if (buttonId === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});

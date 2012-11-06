Ext.application({
    name: 'EnergyApp',

    requires: [
        'Ext.MessageBox',
        'Ext.draw.Color',
        'Ext.chart.axis.Numeric',
        'Ext.chart.series.Area',
        'Ext.chart.interactions.PanZoom',
        'Ext.chart.interactions.ItemInfo',
        'Ext.chart.CartesianChart',
        'Ext.chart.axis.Category',
        'Ext.chart.series.Line',
        'Ext.chart.axis.Numeric',
        'Ext.chart.Legend'
    ],

    models: [
        'NavigationModel'
    ],

    views: [
        'ChartView',
        'AreaChart',
        'LineChart',
        'YearChart',
        'Navigation',
        'Main'
    ],

    stores: ['ChartStore', 'YearStore', 'NavigationStore'],

    controllers: ['Main'],

    icon: {
        '57': 'resource/icons/icon.png',
        '72': 'resource/icons/icon@72.png',
        '114': 'resource/icons/icon@2x.png',
        '144': 'resource/icons/icon@144.png'
    },

    isIconPrecomposed: true,

    startupImage: {
        '320x460': 'resources/startup/320x460.jpg',
        '768x1004': 'resources/startup/768x1004.jpg'
    },

    commify: function (nStr, x) {
        return(nStr / 1000000).toFixed(2);
    },

    loadPieAtYear: function (year) {
        EnergyApp.currentYear = year = year || EnergyApp.currentYear || 2009;
        var store = Ext.getStore("ChartStore"),
            record = store.getAt(store.find('year', year));
        Ext.getStore("YearStore").setData([
            {type: 'Coal', data: record.get('coal')},
            {type: 'Oil', data: record.get('crude-oil')},
            {type: 'Natural Gas', data: record.get('gas')},
            {type: 'Nuclear', data: record.get('nuclear')},
            {type: 'Renewable', data: record.get('renewable')}
        ]);
    },

    popup: function (item, panel) {
        var storeItem = item.record,
            commify = EnergyApp.app.commify;
        panel.setHtml([
            '<ul><li><span style="font-weight: bold">Year: </span>' + storeItem.get('year') + '</li>',
            '<li><span style="font-weight: bold">Coal: </span> ' + commify(storeItem.get('coal')) + '</li>',
            '<li><span style="font-weight: bold">Oil: </span> ' + commify(storeItem.get('crude-oil')) + '</li>',
            '<li><span style="font-weight: bold">Natural Gas: </span> ' + commify(storeItem.get('gas')) + '</li>',
            '<li><span style="font-weight: bold">Nuclear: </span> ' + commify(storeItem.get('nuclear')) + '</li>',
            '<li><span style="font-weight: bold">Renewable: </span> ' + commify(storeItem.get('renewable')) + '</li>',
            '</ul>'
        ].join(''));
    },

    popupYear: function (item, panel) {
        var storeItem = item.record,
            commify = EnergyApp.app.commify;
        panel.setHtml([
            '<ul><li><span style="font-weight: bold">Type: </span>' + storeItem.get('type') + '</li>',
            '<li><span style="font-weight: bold">BTUs: </span> ' + commify(storeItem.get('data')) + '</li>',
            '</ul>'
        ].join(''));
    },

    launch: function () {
        // Initialize the main view
        Ext.Viewport.add(Ext.create('EnergyApp.view.Main', {title: Ext.os.is.Phone ? 'US Energy' : 'US Energy Data Visualization'}));
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
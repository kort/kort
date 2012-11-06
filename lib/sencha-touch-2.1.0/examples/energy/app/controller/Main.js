Ext.define('EnergyApp.controller.Main', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            main: "#main",
            nav: '#navigation',
            navButton: '#navigationButton',
            chartView: '#chartView',
            viewport: '#viewport'
        },
        control: {
            nav: {
                leafitemtap: 'onNavTap'
            },
            navButton: {
                tap: 'showNav'
            },
            viewport: {
                orientationchange: 'onOrientationChange'
            },
            "#prevButton": {
                tap: "prev"
            },
            "#nextButton": {
                tap: "next"
            }
        }
    },

    prev: function () {
        this.getChartView().previous();
    },

    next: function () {
        this.getChartView().next();
    },
    
    // TODO: remove this after control for 'viewport' is enabled.
    launch: function () {
        Ext.Viewport.onBefore('orientationchange', this.onOrientationChange, this);
        this.onOrientationChange(Ext.Viewport, Ext.Viewport.getOrientation());
    },

    showNav: function () {
        this.getMain().getSheet().show();
    },

    onNavTap: function (buttonx, list, index, item) {
        var me = this,
            record = list.getStore().getAt(index),
            mainView = me.getMain(),
            mainRegion = mainView.getMainRegion(),
            chartView = me.getChartView(),
            type = record.parentNode.data.key,
            state = record.data.key;
        mainRegion.setActiveItem(chartView, 'slide');
        mainView.setTitle(record.label);
        Ext.getCmp('prevButton').setDisabled(true);
        Ext.getCmp('nextButton').setDisabled(true);
        Ext.Ajax.request({
            url: 'app/data/' + type + "_" + state + ".json",
            success: function (response, opts) {
                // decode responseText in order to create json object
                var data = Ext.decode(response.responseText);
                // load it into the charts store: this will update the area series
                Ext.getStore('ChartStore').setData(data.items);
                EnergyApp.app.loadPieAtYear();
                Ext.getCmp('prevButton').setDisabled(chartView.getActiveIndex() === 0);
                Ext.getCmp('nextButton').setDisabled(chartView.getActiveIndex() === chartView.getMaxItemIndex());
            },
            failure: function (response) {
                mainView.setMasked({
                    msg: 'Failed loading!'
                });
            }
        });
    },

    onOrientationChange: function (viewport, orientation) {
        this.getMain().orientate(orientation);
    }
});
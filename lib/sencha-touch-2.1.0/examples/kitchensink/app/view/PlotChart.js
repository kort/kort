//<feature charts>
(function () {
    /**
     * Demonstrates how use Ext.chart.ColumnChart
     */
    var fn = [
        function (x) { return Math.sin(5 * x); },
        function (x) { return x * x * 2 - 1; },
        function (x) { return Math.sqrt((1 + x) / 2) * 2 - 1; },
        function (x) { return Math.random() * 2 - 1; },
        function (x) { return x * x * x; },
        function (x) { return x * x * x - x; },
        function (x) { return Math.cos(10 * x); },
        function (x) { return Math.random() * 2 - 1; }
    ];

    var ct = 0.04,
        delay = 10,
        i = 0, l;

    var createData = function () {
        var delta = arguments[0],
            l = arguments.length,
            data = [],
            i, j,
            rec;
        for (i = -1; i <= 1; i += delta) {
            rec = {
                id: i
            };
            for (j = 1; j < l; ++j) {
                rec['g' + j] = arguments[j](i);
            }
            data.push(rec);
        }
        return data;
    };
    Ext.define('Kitchensink.view.PlotChart', {
        extend: 'Ext.Panel',
        requires: ['Ext.chart.Chart', 'Ext.chart.interactions.PanZoom',
                   'Ext.chart.series.Bar', 'Ext.chart.axis.Numeric', 'Ext.chart.axis.Category'],
        config: {
            cls: 'card1',
            layout: 'fit',
            items: [
                {
                    xtype: 'toolbar',
                    top: 0,
                    right: 0,
                    zIndex: 50,
                    style: {
                        background: 'none'
                    },
                    items: [
                        {
                            xtype: 'spacer'
                        },
                        {
                            iconCls: 'refresh',
                            iconMask: true,
                            text: '&nbsp;Refresh',
                            handler: function () {
                                var store = Ext.getStore('PlotStore');
                                Ext.getStore('PlotStore').setData(createData(ct, fn[++i % fn.length]));
                            }
                        }
                    ]
                },
                {
                    xtype: 'chart',
                    store: {
                        storeId: 'PlotStore',
                        fields: [ 'time', 'g1', 'g2', 'g3', 'g4', 'g5' ]
                    },
                    background: 'white',
                    colors: Kitchensink.view.ColorPatterns.getAlteredBaseColorsHSL({s: -0.1}),
                    interactions: [
                        {
                            type: 'panzoom',
                            axes: {
                                "left": {
                                    allowPan: false,
                                    allowZoom: false
                                },
                                "bottom": {
                                    allowPan: true,
                                    allowZoom: true
                                }
                            }
                        }
                    ],
                    series: [
                        {
                            type: 'bar',
                            xField: 'id',
                            yField: ['g1'],
                            itemInstancing: {
                                fx: {
                                    customDuration: {
                                        globalAlpha: 0
                                    }
                                }
                            },
                            style: {
                                stroke: Kitchensink.view.ColorPatterns.getAlteredBaseColorsHSL({s: -0.1})[0],
                                renderer: function (target, series, index, storeItem) {
                                    var val = Math.abs(series.attr.dataY[index]);
                                    target.globalAlpha = val < 0.01 ? 0 : val;
                                }
                            }
                        }
                    ],
                    axes: [
                        {
                            type: 'numeric',
                            position: 'left',
                            fields: ['g1'],
                            title: 'f(x)',
                            minimum: -1,
                            maximum: 1
                        },
                        {
                            type: 'category',
                            position: 'bottom',
                            fields: ['id'],
                            title: 'x',
                            renderer: function (value) {
                                return value.toFixed(2);
                            }
                        }
                    ]
                }
            ]
        },

        initialize: function () {
            this.callParent();
            Ext.getStore('PlotStore').setData(createData(ct, fn[0]));
            var toolbar = Ext.ComponentQuery.query('toolbar', this)[0],
                interaction = Ext.ComponentQuery.query('interaction', this)[0];
            if (toolbar && interaction && !interaction.isMultiTouch()) {
                toolbar.add(interaction.getModeToggleButton());
            }
        }
    });
})();
//</feature>

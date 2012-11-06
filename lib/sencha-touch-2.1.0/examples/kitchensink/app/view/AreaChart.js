/**
 * Demonstrates how use Ext.chart.LineChart
 */
//<feature charts>
Ext.define('Kitchensink.view.AreaChart', {
    extend: 'Ext.Panel',
    requires: ['Ext.chart.Chart', 'Ext.chart.interactions.PanZoom', 'Ext.chart.series.Area',
               'Ext.chart.axis.Numeric', 'Kitchensink.view.ColorPatterns'],
    config: {
        cls: 'card1',
        layout: 'fit',
        style: 'background: white',
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
                            Ext.getStore('OrderItems').generateData(25);
                        }
                    }
                ]
            },
            {
                xtype: 'chart',
                store: 'OrderItems',
                legend: {
                    position: 'bottom'
                },
                insetPadding: {
                    left: 10,
                    bottom: 0,
                    top: 15,
                    right: 35
                },
                colors: Kitchensink.view.ColorPatterns.getGradientColorsHSL(
                    Kitchensink.view.ColorPatterns.getBaseColors(1), {
                        l: 0.3,
                        s: 0.6
                    }, {
                        l: 0.8,
                        s: 0.7
                    },
                    6),
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
                        type: 'area',
                        xField: 'name',
                        yField: ['g1', 'g2', 'g3', 'g4', 'g5', 'g6'],
                        title: ['G1', 'G2', 'G3', 'G4', 'G5', 'G6'],
                        style: {
                            stroke: 'black',
                            fillOpacity: 0.8
                        }
                    }
                ],
                axes: [
                    {
                        type: 'numeric',
                        position: 'left',
                        fields: ['g1', 'g2', 'g3', 'g4', 'g5', 'g6'],
                        label: {
                            rotate: {
                                degrees: -30
                            }
                        },
                        grid: {
                            odd: {
                                fill: '#e8e8e8'
                            }
                        },
                        title: {
                            text: 'Summation of Data',
                            fontSize: 20
                        }
                    },
                    {
                        type: 'category',
                        position: 'bottom',
                        fields: 'name',
                        grid: true,
                        visibleRange: [0, 0.25],
                        title: {
                            text: 'Item Names',
                            fontSize: 20
                        }
                    }
                ]
            }
        ]
    },

    initialize: function () {
        this.callParent();
        Ext.getStore('OrderItems').generateData(25);
        var toolbar = Ext.ComponentQuery.query('toolbar', this)[0],
            interaction = Ext.ComponentQuery.query('interaction', this)[0];
        if (toolbar && interaction && !interaction.isMultiTouch()) {
            toolbar.add(interaction.getModeToggleButton());
        }
    }
});
//</feature>

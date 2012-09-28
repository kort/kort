/**
 * Demonstrates how use Ext.chart.ColumnChart
 */
Ext.define('Kitchensink.view.ColumnChart', {
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
                            Ext.getStore('OrderItems').generateData(15);
                        }
                    }
                ]
            },
            {
                xtype: 'chart',
                store: 'OrderItems',
                background: 'white',
                innerPadding: {
                    left: 20,
                    right: 20,
                    top: 0,
                    bottom: 0
                },
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
                        xField: 'name',
                        yField: ['g1'],
                        labelField: 'name',
                        style: {
                            stroke: 'rgb(40,40,40)',
                            shadowColor: 'black',
                            shadowOffsetX: 3,
                            shadowOffsetY: 3,
                            maxBarWidth: 30
                        }
                    }
                ],
                axes: [
                    {
                        type: 'numeric',
                        position: 'left',
                        fields: ['g1'],
                        grid: true,
                        label: {
                            rotate: {
                                degrees: -30
                            }
                        }
                    },
                    {
                        type: 'category',
                        position: 'bottom',
                        fields: 'name',
                        visibleRange: [0, 0.5],
                        style: {
                            labelInSpan: false
                        }
                    }
                ]
            }
        ]
    },

    initialize: function () {
        this.callParent();
        Ext.getStore('OrderItems').generateData(15);
        var toolbar = Ext.ComponentQuery.query('toolbar', this)[0],
            interaction = Ext.ComponentQuery.query('interaction', this)[0];
        if (toolbar && interaction) {
            toolbar.add(interaction.getModeToggleButton());
        }
    }
});
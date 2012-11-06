/**
 * Demonstrates how use Ext.chart.ColumnChart
 */
//<feature charts>
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
                colors: Kitchensink.view.ColorPatterns.getAlteredBaseColorsHSL({l:0.2}),
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
                    },
                    'itemhighlight'
                ],
                series: [
                    {
                        type: 'bar',
                        xField: 'name',
                        yField: ['g1'],
                        labelField: 'name',

                        highlightCfg: {
                            strokeStyle: 'red'
                        },
                        
                        style: {
                            stroke: 'rgb(40,40,40)',
                            shadowColor: 'black',
                            shadowOffsetX: 3,
                            shadowOffsetY: 3,
                            minGapWidth: 1,
                            maxBarWidth: 30
                        }
                    }
                ],
                axes: [
                    {
                        type: 'numeric',
                        position: 'left',
                        fields: ['g1'],
                        grid: {
                            odd: {
                                fill: '#e8e8e8'
                            }
                        },
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
                        visibleRange: [0, 0.5]
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
        if (toolbar && interaction && !interaction.isMultiTouch()) {
            toolbar.add(interaction.getModeToggleButton());
        }
    }
});
//</feature>

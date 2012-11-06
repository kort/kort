/**
 * Demonstrates how use Ext.chart.LineChart
 */
//<feature charts>
Ext.define('Kitchensink.view.ScatterChart', {
    extend: 'Ext.Panel',
    requires: ['Ext.chart.Chart', 'Ext.chart.series.Scatter', 'Ext.chart.axis.Numeric'],
    config: {
        cls: 'card1',
        layout: 'fit',
        items: [
            {
                xtype: 'toolbar',
                docked: 'top',
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
                background: 'white',
                interactions: [
                    'panzoom',
                    'itemhighlight'
                ],
                series: [
                    {
                        type: 'scatter',
                        xField: 'id',
                        yField: 'g1',
                        highlightCfg: {
                            strokeStyle: 'red',
                            lineWidth: 2
                        },
                        marker: {
                            type: 'path',
                            path: [
                                ['M' , 0, 1],
                                ['L', 1, 0],
                                ['L', 0, -1],
                                ['L', -1, 0],
                                ['Z']
                            ],
                            scale: 5,
                            fill: 'rgba(143,203,203,0.90)',
                            miterLimit: 1,
                            lineCap: 'butt',
                            lineWidth: 1
                        }
                    },
                    {
                        type: 'scatter',
                        xField: 'id',
                        yField: 'g2',
                        highlightCfg: {
                            strokeStyle: 'red',
                            lineWidth: 2
                        },
                        marker: {
                            type: 'circle',
                            radius: 5,
                            fill: 'rgba(203,143,203,0.90)',
                            miterLimit: 1,
                            lineCap: 'butt',
                            lineWidth: 1
                        }
                    }
                ],
                axes: [
                    {
                        type: 'numeric',
                        position: 'left',
                        fields: ['g1', 'g2', 'g3', 'g4'],
                        minimum: 0,
//                        maximum: 2000,
                        visibleRange: [0, 1],
                        style: {
                            estStepSize: 20
                        },
                        label: {
                            rotate: {
                                degrees: -30
                            }
                        }
                    },
                    {
                        type: 'numeric',
                        position: 'bottom',
                        visibleRange: [0, 0.5],
                        fields: 'id'
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

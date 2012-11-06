/**
 * Demonstrates how use Ext.chart.LineChart
 */
//<feature charts>
Ext.define('Kitchensink.view.ColumnChart3D', {
    extend: 'Ext.Panel',
    requires: ['Ext.chart.Chart', 'Ext.chart.interactions.PanZoom',
               'Kitchensink.view.ColumnSeries3D', 'Ext.chart.axis.Numeric', 'Ext.chart.axis.Category'],
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
                            Ext.getStore('OrderItems').generateData(25);
                        }
                    }
                ]
            },
            {
                xtype: 'chart',
                store: 'OrderItems',
                background: '#EEE',
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
                        type: 'column3d',
                        xField: 'name',
                        yField: 'g1',
                        style: {
                            fill: '#8a8',
//                            stroke: 'rgba(143,203,203,0.5)',
                            maxBarWidth: 50,
                            lineJoin: 'miter',
                            miterLimit: 3
                        }
                    }
                ],
                axes: [
                    {
                        type: 'numeric',
                        position: 'left',
                        fields: ['g1', 'g2', 'g3', 'g4'],
                        minimum: 0,
                        maximum: 1250,
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
                        visibleRange: [0, 0.2]
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

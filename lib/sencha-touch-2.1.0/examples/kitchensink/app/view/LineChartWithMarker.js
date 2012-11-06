/**
 * Demonstrates how use Ext.chart.series.Line
 */
//<feature charts>
Ext.define('Kitchensink.view.LineChartWithMarker', {
    extend: 'Ext.Panel',
    requires: ['Ext.chart.Chart', 'Ext.chart.series.Line', 'Ext.chart.axis.Numeric', 'Ext.draw.modifier.Highlight',
               'Ext.chart.axis.Time', 'Ext.chart.interactions.ItemHighlight'],
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
                        handler: function (a, b, c, d, e) {
                            Ext.getStore('Pie').generateData(10);
                        }
                    }
                ]
            },
            {
                xtype: 'chart',
                store: 'Pie',
                interactions: [
                    {
                        type: 'panzoom',
                        zoomOnPanGesture: false
                    },
                    'itemhighlight'
                ],
                legend: {
                    position: 'bottom'
                },
                series: [
                    {
                        type: 'line',
                        xField: 'name',
                        yField: 'g1',
                        style: {
                            smooth: true,
                            stroke: 'rgb(143,203,203)',
                            fill: 'rgba(143,203,203,0.3)',
                            miterLimit: 3,
                            lineCap: 'miter',
                            lineWidth: 2
                        },
                        title: 'Square',
                        
                        highlightCfg: {
                            scale: 0.7
                        },
                        
                        marker: {
                            type: 'image',
                            src: 'glyphicons_094_vector_path_square.png',
                            width: 46,
                            height: 46,
                            x: -23,
                            y: -23,
                            scale: 0.5,
                            fx: {
                                duration: 200
                            }
                        }
                    },
                    {
                        type: 'line',
                        xField: 'name',
                        yField: 'g2',
                        style: {
                            stroke: 'rgb(143,203,203)',
                            lineWidth: 2
                        },
                        title: 'Circle',


                        highlightCfg: {
                            scale: 0.7
                        },
                        
                        marker: {
                            type: 'image',
                            src: 'glyphicons_095_vector_path_circle.png',
                            width: 46,
                            height: 46,
                            x: -23,
                            y: -23,
                            scale: 0.5,
                            fx: {
                                duration: 200
                            }
                        }
                    },
                    {
                        type: 'line',
                        xField: 'name',
                        yField: 'g3',
                        style: {
                            stroke: 'rgb(143,203,203)',
                            lineWidth: 2
                        },
                        title: 'Polygon',

                        highlightCfg: {
                            scale: 0.7
                        },
                        
                        marker: {
                            type: 'image',
                            src: 'glyphicons_096_vector_path_polygon.png',
                            width: 48,
                            height: 48,
                            x: -24,
                            y: -24,
                            scale: 0.5,
                            fx: {
                                duration: 200
                            }
                        }
                    }
                ],
                axes: [
                    {
                        type: 'numeric',
                        position: 'left',
                        fields: ['g1', 'g2', 'g3'],
                        minimum: 0
                    },
                    {
                        type: 'category',
                        position: 'bottom',
                        visibleRange: [0, 0.5],
                        fields: 'name'
                    }
                ]
            }
        ]
    },
    initialize: function () {
        this.callParent();
        Ext.getStore('Pie').generateData(10);
        var toolbar = Ext.ComponentQuery.query('toolbar', this)[0],
            interaction = Ext.ComponentQuery.query('interaction', this)[0];
        if (toolbar && interaction && !interaction.isMultiTouch()) {
            toolbar.add(interaction.getModeToggleButton());
        }
    }
});
//</feature>

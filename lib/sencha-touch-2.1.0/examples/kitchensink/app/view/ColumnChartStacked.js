/**
 * Demonstrates how use Ext.chart.ColumnChartStacked
 */
//<feature charts>
Ext.define('Kitchensink.view.ColumnChartStacked', {
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
                        text: 'Refresh',
                        handler: function () {
                            Ext.getStore('OrderItems').generateData(25);
                        }
                    },
                    {
                        iconCls: 'loop2',
                        iconMask: true,
                        text: 'Stack',
                        handler: function (button) {
                            var chart = Ext.ComponentQuery.query('chart', this.getParent().getParent())[0],
                                series = chart.getSeries()[0];
                            button.setText(series.getStacked() ? 'Stack' : 'Group');
                            series.setStacked(!series.getStacked());
                            chart.redraw();
                        }
                    }
                ]
            },
            {
                xtype: 'chart',
                store: 'OrderItems',
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
                        xField: 'name',
                        yField: ['g1', 'g2', 'g3', 'g4', 'g5'],
                        stacked: false,
                        style: {
                            stroke: 'rgb(40,40,40)'
                        }
                    }
                ],
                axes: [
                    {
                        type: 'numeric',
                        position: 'left',
                        fields: ['g1', 'g2', 'g3', 'g4', 'g5'],
//                        maximum: 5000,
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
        Ext.getStore('OrderItems').generateData(25);
        var toolbar = Ext.ComponentQuery.query('toolbar', this)[0],
            interaction = Ext.ComponentQuery.query('interaction', this)[0];
        if (toolbar && interaction && !interaction.isMultiTouch()) {
            toolbar.add(interaction.getModeToggleButton());
        }
    }
});
//</feature>
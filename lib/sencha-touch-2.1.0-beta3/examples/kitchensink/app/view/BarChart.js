/**
 * Demonstrates how use Ext.chart.ColumnChart
 */
Ext.define('Kitchensink.view.BarChart', {
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
                            Ext.getStore('Pie').generateData(15);
                        }
                    }
                ]
            },
            {
                xtype: 'chart',
                store: 'Pie',
                background: 'white',
                flipXY: true,
                innerPadding: {
                    left: 0,
                    right: 10,
                    top: 20,
                    bottom: 20
                },
                colors: Kitchensink.view.ColorPatterns.getBaseColors(),
                interactions: [
                    {
                        type: 'panzoom'
                    }
                ],
                series: [
                    {
                        type: 'bar',
                        xField: 'name',
                        yField: ['g1', 'g2', 'g3', 'g4', 'g5'],
                        style: {
                            stroke: 'rgb(40,40,40)',
                            shadowColor: 'black',
                            shadowOffsetX: 2,
                            shadowOffsetY: 2,
                            maxBarWidth: 20
                        }
                    }
                ],
                axes: [
                    {
                        type: 'numeric',
                        position: 'bottom',
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
                        position: 'left',
                        fields: 'name',
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
        Ext.getStore('Pie').generateData(15);
        var toolbar = Ext.ComponentQuery.query('toolbar', this)[0],
            interaction = Ext.ComponentQuery.query('interaction', this)[0];
        if (toolbar && interaction) {
            toolbar.add(interaction.getModeToggleButton());
        }
    }
});